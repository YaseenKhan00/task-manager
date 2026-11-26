
import { useState } from 'react'
import { User, Mail, Save, Camera, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

function Profile() {
  const { user } = useAuth()

  const [name, setName] = useState(
    user?.user_metadata?.full_name || ''
  )

  const [avatar, setAvatar] = useState(
    user?.user_metadata?.avatar_url || ''
  )

  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      let avatarUrl = avatar

      // Upload Profile Picture
      if (file) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please select an image file.')
        }

        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Image size must be less than 2 MB.')
        }

        const extension = file.name.split('.').pop()
        const filePath = `${user.id}/avatar-${Date.now()}.${extension}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        avatarUrl = data.publicUrl
      }

      // Update Name and Profile Picture
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarUrl
        }
      })

      if (updateError) throw updateError

      setAvatar(avatarUrl)
      setFile(null)

      // Change Password
      if (password || confirmPassword) {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.')
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }

        const { error: passwordError } = await supabase.auth.updateUser({
          password: password
        })

        if (passwordError) throw passwordError

        setPassword('')
        setConfirmPassword('')
        setMessage('Profile and password updated successfully!')
      } else {
        setMessage('Profile updated successfully!')
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your personal information.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">

          <div className="relative w-28 h-28">
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">

              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={55} className="text-blue-600" />
              )}

            </div>

            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer">
              <Camera size={17} />

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <h2 className="text-xl font-bold mt-4">
            {name || 'User'}
          </h2>

          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>
        </div>

        {/* Messages */}
        {message && (
          <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <div className="flex items-center border rounded-lg px-3">
              <User size={19} className="text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-2">
              Email Address
            </label>

            <div className="flex items-center border rounded-lg px-3 bg-gray-100">
              <Mail size={19} className="text-gray-400" />

              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full p-3 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="border-t pt-5 space-y-4">

            <h2 className="text-lg font-bold flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h2>

            <div>
              <label className="block font-medium mb-2">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={8}
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter password again"
                className="w-full border rounded-lg p-3 outline-none"
              />
            </div>

            <p className="text-xs text-gray-500">
              Leave both password fields empty if you do not want to change your password.
            </p>

          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            <Save size={18} />

            {loading ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Profile
