function UserModal({ isOpen, onClose, mode, user, setUser, onSubmit, roles }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-md mx-4">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add New User' : 'Edit User'}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
              maxLength={50}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full p-2 border rounded"
              required
              maxLength={100}
            />
          </div>
          {mode === 'add' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full p-2 border rounded"
                required
                minLength={6}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="roleId">
              Role
            </label>
            <select
              id="roleId"
              value={user.roleId}
              onChange={(e) => setUser({ ...user, roleId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 sm:px-6 py-3 rounded-full hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                mode === 'add' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
              } text-white px-4 sm:px-6 py-3 rounded-full`}
            >
              {mode === 'add' ? 'Add User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;