import Banner from './Banner';
import CategoryList from './CategoryList';

function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner and Categories Section */}
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <CategoryList />
          <Banner />
        </div>
      </div>
    </div>
  );
}

export default Home;