function UserTable({ users, openEditModal, handleDeleteUser, openAddModal }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">User List</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-blue-600"
        >
          Add User
        </button>
      </div>
      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto md:table">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Username</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Full Name</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Created At</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="block md:table-row border-b mb-4 md:mb-0">
                  <td className="block md:table-cell p-2 before:content-['ID:'] before:font-bold before:mr-2 md:before:content-none">
                    {user.userId}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Username:'] before:font-bold before:mr-2 md:before:content-none">
                    {user.username}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Email:'] before:font-bold before:mr-2 md:before:content-none max-w-xs break-words">
                    {user.email}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Full_Name:'] before:font-bold before:mr-2 md:before:content-none max-w-xs break-words">
                    {user.fullName}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Role:'] before:font-bold before:mr-2 md:before:content-none">
                    {user.role || '-'}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Created_At:'] before:font-bold before:mr-2 md:before:content-none">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="block md:table-cell p-2 before:content-['Actions:'] before:font-bold before:mr-2 md:before:content-none">
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-yellow-500 text-white px-4 sm:px-6 py-3 rounded-full mr-2 hover:bg-yellow-600 mb-2 md:mb-0"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.userId)}
                      className="bg-red-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-red-600"
                    >
                      Delete
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

export default UserTable;