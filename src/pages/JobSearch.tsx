
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobSearch from "@/components/JobSearch";

const JobSearchPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <JobSearch />
      <Footer />
    </div>
  );
};

export default JobSearchPage;
