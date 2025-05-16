function CategoryTable({ categories, openEditModal, handleDeleteCategory, openAddModal }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Danh sách thể loại</h2>
        <button
          onClick={openAddModal}
          className="bg-purple-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-blue-600"
        >
          Thêm thể loại
        </button>
      </div>
      {categories.length === 0 ? (
        <p className="text-gray-600">Không tìm thấy thể loại.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Tên</th>
                <th className="p-2 text-left">Mô tả</th>
                <th className="p-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId} className="block md:table-row border-b mb-4 md:mb-0">
                  <td className="block md:table-cell p-2 before:content-['ID:'] before:font-bold before:mr-2 md:before:content-none">
                    {category.categoryId}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Name:'] before:font-bold before:mr-2 md:before:content-none">
                    {category.name}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Description:'] before:font-bold before:mr-2 md:before:content-none max-w-xs break-words">
                    {category.description || '-'}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Actions:'] before:font-bold before:mr-2 md:before:content-none">
                    <button
                      onClick={() => openEditModal(category)}
                      className="bg-yellow-500 text-white px-4 sm:px-6 py-3 rounded-full mr-2 hover:bg-yellow-600 mb-2 md:mb-0"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.categoryId)}
                      className="bg-red-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CategoryTable;