import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { Sidebar } from './components/layout/Sidebar'

function App() {

  return (
    <div className="flex min-h-screen w-full bg-[#e9edf1]">
      <Sidebar />

      <main className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
        <Outlet />
      </main>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default App
