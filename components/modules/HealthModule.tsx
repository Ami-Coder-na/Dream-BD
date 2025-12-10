
import React from 'react';
import { HeartPulse, Calendar, Phone, MapPin, Star, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  isBangla: boolean;
}

export const HealthModule: React.FC<Props> = ({ isBangla }) => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Farhana Ahmed',
      specialty: isBangla ? 'কার্ডিওলজিস্ট' : 'Cardiologist',
      hospital: 'Dhaka Medical College',
      rating: 4.9,
      experience: '12 Years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150'
    },
    {
      id: 2,
      name: 'Dr. S.M. Kamal',
      specialty: isBangla ? 'মেডিসিন বিশেষজ্ঞ' : 'Medicine Specialist',
      hospital: 'Square Hospital',
      rating: 4.7,
      experience: '8 Years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=150'
    },
    {
      id: 3,
      name: 'Dr. Nusrat Jahan',
      specialty: isBangla ? 'শিশু বিশেষজ্ঞ' : 'Pediatrician',
      hospital: 'Evercare Hospital',
      rating: 4.8,
      experience: '10 Years',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=150'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full animate-pulse">
            <Phone className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-lg">
              {isBangla ? 'জরুরী সেবা প্রয়োজন?' : 'Need Emergency Help?'}
            </h3>
            <p className="text-red-600 text-sm">
              {isBangla ? 'তাৎক্ষণিক অ্যাম্বুলেন্স বা জরুরী পরামর্শের জন্য কল করুন' : 'Call for immediate ambulance or emergency advice'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" className="font-bold text-lg px-8">
            999
          </Button>
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
            {isBangla ? 'নিকটস্থ হাসপাতাল' : 'Nearby Hospital'}
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBangla ? 'ডাক্তার খুঁজুন' : 'Find Doctor', icon: <UserPlus />, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: isBangla ? 'অ্যাপয়েন্টমেন্ট' : 'Appointments', icon: <Calendar />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: isBangla ? 'ঔষধ' : 'Medicines', icon: <HeartPulse />, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: isBangla ? 'হেলথ রেকর্ড' : 'Health Records', icon: <MapPin />, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-6 rounded-xl border border-transparent hover:border-gray-200 cursor-pointer transition-all text-center group`}>
            <div className={`w-12 h-12 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-3 ${item.color} group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <p className="font-semibold text-gray-800">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Doctor List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isBangla ? 'জনপ্রিয় ডাক্তারগণ' : 'Popular Doctors'}
          </h3>
          <Button variant="outline" size="sm">{isBangla ? 'সব দেখুন' : 'View All'}</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all">
              <img src={doc.image} alt={doc.name} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{doc.name}</h4>
                    <p className="text-teal-600 text-sm font-medium">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-0.5 rounded">
                    <Star size={12} fill="currentColor" className="mr-1" />
                    {doc.rating}
                  </div>
                </div>
                
                <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                  <MapPin size={12} /> {doc.hospital} • {doc.experience} Exp
                </p>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 flex-1">
                    {isBangla ? 'বুকিং দিন' : 'Book Visit'}
                  </Button>
                  <Button size="sm" variant="outline" className="px-3">
                    <Calendar size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
