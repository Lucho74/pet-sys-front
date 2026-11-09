import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

function App() {

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar />

        <SidebarInset className="min-w-0 bg-[#e9edf1]">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App
