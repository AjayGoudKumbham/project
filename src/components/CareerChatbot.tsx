
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Send, Bot, User, X, MessageSquare, MinimizeIcon } from "lucide-react";
import { callGeminiApi, buildChatPrompt } from "@/utils/geminiApi";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const CareerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: "Hi! I'm your AI career assistant. How can I help you with your job search or career questions today?",
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    
    try {
      const response = await callGeminiApi(buildChatPrompt(newMessage));
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response from chatbot:", error);
      toast.error("Sorry, I couldn't process your message right now.");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsMinimized(true);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  // Formatted message display
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-4 right-4 rounded-full p-4 h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className={`fixed right-4 shadow-lg transition-all duration-300 ${
          isMinimized 
            ? 'bottom-4 h-14 w-64' 
            : 'bottom-4 h-[500px] w-[350px] sm:w-[400px]'
        }`}>
          {/* Chat header */}
          <CardHeader className="p-3 flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-sm font-medium flex items-center gap-2" onClick={toggleChat}>
              <Bot size={18} />
              {isMinimized ? "Career Assistant" : "AI Career Assistant"}
            </CardTitle>
            <div className="flex gap-1">
              {!isMinimized && (
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground" onClick={() => setIsMinimized(true)}>
                  <MinimizeIcon className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground" onClick={closeChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Chat content - only visible when not minimized */}
          {!isMinimized && (
            <>
              <CardContent className="p-3 h-[calc(100%-110px)]">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <Avatar className={`h-8 w-8 ${message.role === 'assistant' ? 'bg-primary' : 'bg-muted'}`}>
                            {message.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          </Avatar>
                          <div className={`rounded-lg px-3 py-2 text-sm ${
                            message.role === 'assistant' 
                              ? 'bg-muted' 
                              : 'bg-primary text-primary-foreground'
                          }`}>
                            {formatMessage(message.content)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8 bg-primary">
                            <Bot className="h-4 w-4" />
                          </Avatar>
                          <div className="rounded-lg px-3 py-2 text-sm bg-muted flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Thinking...
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>

              <CardFooter className="p-3 pt-2 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !newMessage.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </>
  );
};

export default CareerChatbot;
