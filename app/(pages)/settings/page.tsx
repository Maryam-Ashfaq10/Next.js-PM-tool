// app/settings/page.tsx
export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* User Info */}
      <section className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:</span> John Doe
          </div>
          <div>
            <span className="font-medium">Email:</span> john.doe@example.com
          </div>
          <div>
            <span className="font-medium">Role:</span> Admin
          </div>
        </div>
      </section>

      {/* Settings Options */}
      <section className="p-6 border rounded-md bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input type="checkbox" className="toggle-checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <span>Enable Notifications</span>
            <input type="checkbox" className="toggle-checkbox" />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto Save</span>
            <input type="checkbox" className="toggle-checkbox" />
          </div>
        </div>
      </section>

    
    </div>
  );
}
