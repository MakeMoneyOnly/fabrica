'use client'

import { Calendar as CalendarIcon, Clock, Video, Users } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Calendar</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Manage your coaching sessions, consultations, and appointments all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Clock className="w-8 h-8 text-purple-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
            <p className="text-sm text-gray-500">Set your available time slots and booking rules</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Video className="w-8 h-8 text-blue-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Meeting Links</h3>
            <p className="text-sm text-gray-500">Integrate Zoom, Google Meet, or phone calls</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <Users className="w-8 h-8 text-green-600 mb-3 mx-auto" />
            <h3 className="font-semibold text-gray-900 mb-2">Client Management</h3>
            <p className="text-sm text-gray-500">Track bookings and send automated reminders</p>
          </div>
        </div>

        <div className="inline-flex items-center px-6 py-3 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
          <span className="font-medium">Coming Soon</span>
          <span className="ml-2 text-sm">
            • Calendar booking system will be available in the next update
          </span>
        </div>
      </div>
    </div>
  )
}
