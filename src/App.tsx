import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'

function App() {

  return (
    <div className="flex min-h-screen w-full bg-[#e9edf1]">
      <Sidebar />

      <main className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
        <Outlet />
      </main>

    </div>
  )
}

export default App
