import Header from "./Header";
import SideMenu from "./SideMenu";

export default function Layout({ children }: any) {
    return (
        <>
        <Header />
          <div className="flex h-screen">
        
                  <aside className="w-50 bg-gray-100 border-r border-gray-300 p-4">
                    <SideMenu />
                  </aside>
        
                  {/* Main Body */}
                  <main className="flex-1 p-6  bg-white">
                    {children}
                  </main>
        
                </div>
        </>
    )

}