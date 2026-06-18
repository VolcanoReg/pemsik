import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa.jsx";

function LoginForm(){
    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Masukkan email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Masukkan password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Ingat saya</span>
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">Lupa password?</a>
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Login</button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Belum punya akun?
          <a href="#" className="text-blue-500 hover:underline">Daftar</a>
        </p>
      </div>
    </div>
  );
}

function App(){
    //return (<LoginForm/>)
    return <Mahasiswa />
}


export default App;