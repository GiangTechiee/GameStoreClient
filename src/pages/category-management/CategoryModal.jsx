function CategoryModal({ isOpen, onClose, mode, category, setCategory, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-md mx-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New Category' : 'Edit Category'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Tên thể loại
            </label>
            <input
              type="text"
              id="name"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
              maxLength={50}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="description">
              Mô tả (Tùy chọn)
            </label>
            <textarea
              id="description"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Enter category description"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`${
                mode === 'add' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 sm:px-6 py-3 rounded-full`}
            >
              {mode === 'add' ? 'Add Category' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;