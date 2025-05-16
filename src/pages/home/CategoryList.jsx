import { Link } from "react-router-dom";


function CategoryList() {
  // Danh mục ánh xạ với endpoint API và filter
  const categories = [
    {
      title: "Game mới cập nhật",
      link: "/games",
      api: "/Game/sort/release-date",
      filter: "new",
    },
    {
      title: "Game được xem nhiều",
      link: "/games",
      api: "/Game/sort/view-count",
      filter: "views",
    },
    {
      title: "Game of the year",
      link: "/games",
      api: "/Game/goty/true",
      filter: "goty",
    },
    {
      title: "Phần mềm",
      link: "/games",
      api: "/Game/category/10",
      filter: "software",
    },
    
    // {
    //   title: "Thủ thuật",
    //   link: "/tips",
    //   api: "Game/category/",
    //   filter: "tips",
    // },
  ];

  return (
    <div className="lg:w-1/3 lg:order-2">
      <div className="space-y-6">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={{
              pathname: category.link,
              state: { api: category.api, filter: category.filter },
            }}
            className="block shadow-md p-4 hover:shadow-lg rounded-full bg-purple-700 hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-xl text-white">{category.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;