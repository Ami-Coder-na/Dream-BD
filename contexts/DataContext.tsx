
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { User, UserRole } from '../types';

// COMPLETE AND ACCURATE DATA FOR ALL 64 DISTRICTS OF BANGLADESH
const INITIAL_DISTRICT_LIST = [
  // DHAKA DIVISION (13)
  { id: 'dhaka', nameen: 'Dhaka', namebn: 'ঢাকা', division: 'Dhaka', population: '14.7M', area: '1,463 km²', description: 'Capital of Bangladesh, a historic hub.', upazilas: ['Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'], touristspots: ['Lalbagh Fort', 'Ahsan Manzil', 'National Parliament'], education: { primary: 1250, highSchool: 450, college: 85, university: 12 } },
  { id: 'gazipur', nameen: 'Gazipur', namebn: 'গাজীপুর', division: 'Dhaka', population: '3.4M', area: '1,806 km²', description: 'Industrial hub with forests.', upazilas: ['Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'], touristspots: ['Bhawal National Park', 'Safari Park'] },
  { id: 'narayanganj', nameen: 'Narayanganj', namebn: 'নারায়ণগঞ্জ', division: 'Dhaka', population: '2.9M', area: '684 km²', description: 'Industrial city, Dundee of the East.', upazilas: ['Araihazar', 'Bandar', 'Sadar', 'Rupganj', 'Sonargaon'], touristspots: ['Panam City', 'Sonargaon Museum'] },
  { id: 'tangail', nameen: 'Tangail', namebn: 'টাঙ্গাইল', division: 'Dhaka', population: '3.6M', area: '3,414 km²', description: 'Famous for Saree and sweets.', upazilas: ['Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'], touristspots: ['Mohera Jamindar Bari'] },
  { id: 'kishoreganj', nameen: 'Kishoreganj', namebn: 'কিশোরগঞ্জ', division: 'Dhaka', population: '2.9M', area: '2,688 km²', description: 'Land of Haors.', upazilas: ['Sadar', 'Itna', 'Mithamain', 'Nikli', 'Karimganj', 'Bajitpur', 'Austagram', 'Hossainpur'], touristspots: ['Nikli Haor', 'Mithamain Road'] },
  { id: 'manikganj', nameen: 'Manikganj', namebn: 'মানিকগঞ্জ', division: 'Dhaka', population: '1.4M', area: '1,383 km²', description: 'Historic palaces and greenery.', upazilas: ['Sadar', 'Singair', 'Shivalaya', 'Saturia', 'Harirampur', 'Ghior', 'Daulatpur'], touristspots: ['Baliati Palace'] },
  { id: 'munshiganj', nameen: 'Munshiganj', namebn: 'মুন্সীগঞ্জ', division: 'Dhaka', population: '1.4M', area: '954 km²', description: 'Ancient Bikrampur region.', upazilas: ['Sadar', 'Lohajang', 'Srinagar', 'Sirajdikhan', 'Tongibari', 'Gazaria'], touristspots: ['Idrakpur Fort'] },
  { id: 'narsingdi', nameen: 'Narsingdi', namebn: 'নরসিংদী', division: 'Dhaka', population: '2.2M', area: '1,141 km²', description: 'Textile and banana production center.', upazilas: ['Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur'], touristspots: ['Wari-Bateshwar'] },
  { id: 'faridpur', nameen: 'Faridpur', namebn: 'ফরিদপুর', division: 'Dhaka', population: '1.9M', area: '2,072 km²', description: 'Famous for Jute.', upazilas: ['Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Saltha'], touristspots: ['River Research Institute'] },
  { id: 'gopalganj', nameen: 'Gopalganj', namebn: 'গোপালগঞ্জ', division: 'Dhaka', population: '1.2M', area: '1,490 km²', description: 'Birthplace of Bangabandhu.', upazilas: ['Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'], touristspots: ['Mausoleum of Bangabandhu'] },
  { id: 'madaripur', nameen: 'Madaripur', namebn: 'মাদারীপুর', division: 'Dhaka', population: '1.2M', area: '1,144 km²', description: 'Historic river port district.', upazilas: ['Sadar', 'Kalkini', 'Rajoir', 'Shibchar'], touristspots: ['Shakuni Lake'] },
  { id: 'shariatpur', nameen: 'Shariatpur', namebn: 'শরীয়তপুর', division: 'Dhaka', population: '1.1M', area: '1,181 km²', description: 'Bordered by Padma and Meghna.', upazilas: ['Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zajira'], touristspots: ['Fateh Jangpur Fort'] },
  { id: 'rajbari', nameen: 'Rajbari', namebn: 'রাজবাড়ী', division: 'Dhaka', population: '1.0M', area: '1,118 km²', description: 'Railway and river centered town.', upazilas: ['Sadar', 'Baliakandi', 'Goalandaghat', 'Kalukhali', 'Pangsha'], touristspots: ['Gododhi'] },

  // CHATTOGRAM DIVISION (11)
  { id: 'chattogram', nameen: 'Chattogram', namebn: 'চট্টগ্রাম', division: 'Chattogram', population: '9.1M', area: '5,283 km²', description: 'Commercial capital and port city.', upazilas: ['Anwara', 'Banshkhali', 'Boalkhali', 'Hathazari', 'Patiya', 'Sitakunda', 'Mirsharai', 'Rangunia', 'Raozan', 'Sandwip'], touristspots: ['Patenga Beach', 'Foy\'s Lake'] },
  { id: 'coxsbazar', nameen: "Cox's Bazar", namebn: 'কক্সবাজার', division: 'Chattogram', population: '2.8M', area: '2,492 km²', description: 'World\'s longest sandy beach.', upazilas: ['Sadar', 'Chakaria', 'Maheshkhali', 'Teknaf', 'Ukhia', 'Pekua', 'Ramu', 'Kutubdia'], touristspots: ['Inani Beach', 'Saint Martin\'s'] },
  { id: 'comilla', nameen: 'Comilla', namebn: 'কুমিল্লা', division: 'Chattogram', population: '6.2M', area: '3,087 km²', description: 'Famous for Shalban Vihara.', upazilas: ['Sadar', 'Barura', 'Chandina', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Nangalkot'], touristspots: ['Shalban Vihara', 'Mainamati'] },
  { id: 'brahmanbaria', nameen: 'Brahmanbaria', namebn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', population: '3.3M', area: '1,927 km²', description: 'Cultural capital of Bangladesh.', upazilas: ['Sadar', 'Ashuganj', 'Bancharampur', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'], touristspots: ['Arifil Mosque'] },
  { id: 'chandpur', nameen: 'Chandpur', namebn: 'চাঁদপুর', division: 'Chattogram', population: '2.6M', area: '1,704 km²', description: 'Hilsa capital.', upazilas: ['Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar'], touristspots: ['Mohona'] },
  { id: 'feni', nameen: 'Feni', namebn: 'ফেনী', division: 'Chattogram', population: '1.6M', area: '928 km²', description: 'Gateway to Chattogram.', upazilas: ['Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Fulgazi', 'Sonagazi'], touristspots: ['Muhuri Project'] },
  { id: 'lakshmipur', nameen: 'Lakshmipur', namebn: 'লক্ষ্মীপুর', division: 'Chattogram', population: '1.9M', area: '1,455 km²', description: 'Famous for Soybean.', upazilas: ['Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'], touristspots: ['Dalal Bazar Palace'] },
  { id: 'noakhali', nameen: 'Noakhali', namebn: 'নোয়াখালী', division: 'Chattogram', population: '3.5M', area: '3,601 km²', description: 'Historic coastal district.', upazilas: ['Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Subarnachar'], touristspots: ['Nijhum Dwip'] },
  { id: 'rangamati', nameen: 'Rangamati', namebn: 'রাঙ্গামাটি', division: 'Chattogram', population: '0.6M', area: '6,116 km²', description: 'Lake district of Hills.', upazilas: ['Sadar', 'Bagaichhari', 'Barkal', 'Kawkhali', 'Belaichhari', 'Kaptai', 'Juraichhari', 'Langadu', 'Naniarchar', 'Rajasthali'], touristspots: ['Kaptai Lake'] },
  { id: 'khagrachhari', nameen: 'Khagrachhari', namebn: 'খাগড়াছড়ি', division: 'Chattogram', population: '0.7M', area: '2,699 km²', description: 'Hill district with caves.', upazilas: ['Sadar', 'Dighinala', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'], touristspots: ['Alutila Cave'] },
  { id: 'bandarban', nameen: 'Bandarban', namebn: 'বান্দরবান', division: 'Chattogram', population: '0.4M', area: '4,479 km²', description: 'Highest hills of Bangladesh.', upazilas: ['Sadar', 'Alikadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'], touristspots: ['Nilagiri', 'Boga Lake'] },

  // RAJSHAHI DIVISION (8)
  { id: 'rajshahi', nameen: 'Rajshahi', namebn: 'রাজশাহী', division: 'Rajshahi', population: '2.9M', area: '2,407 km²', description: 'Silk city and educational hub.', upazilas: ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'], touristspots: ['Varendra Museum'] },
  { id: 'bogra', nameen: 'Bogra', namebn: 'বগুড়া', division: 'Rajshahi', population: '3.7M', area: '2,898 km²', description: 'Historic Mahasthangarh location.', upazilas: ['Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Sherpur', 'Shibganj', 'Sonatola'], touristspots: ['Mahasthangarh'] },
  { id: 'pabna', nameen: 'Pabna', namebn: 'পাবনা', division: 'Rajshahi', population: '2.7M', area: '2,371 km²', description: 'Famous for Mental Hospital and Bridge.', upazilas: ['Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'], touristspots: ['Hardinge Bridge'] },
  { id: 'sirajganj', nameen: 'Sirajganj', namebn: 'সিরাজগঞ্জ', division: 'Rajshahi', population: '3.2M', area: '2,497 km²', description: 'Gateway to North Bengal.', upazilas: ['Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullapara'], touristspots: ['Jamuna Bridge'] },
  { id: 'natore', nameen: 'Natore', namebn: 'নাটোর', division: 'Rajshahi', population: '1.8M', area: '1,896 km²', description: 'Famous for Kachagolla.', upazilas: ['Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra'], touristspots: ['Natore Rajbari'] },
  { id: 'naogaon', nameen: 'Naogaon', namebn: 'নওগাঁ', division: 'Rajshahi', population: '2.8M', area: '3,435 km²', description: 'Rice and historic sites.', upazilas: ['Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'], touristspots: ['Paharpur'] },
  { id: 'chapainawabganj', nameen: 'Chapainawabganj', namebn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', population: '1.8M', area: '1,702 km²', description: 'Mango capital.', upazilas: ['Sadar', 'Bholahat', 'Gomastapur', 'Nachole', 'Shibganj'], touristspots: ['Choto Sona Mosque'] },
  { id: 'joypurhat', nameen: 'Joypurhat', namebn: 'জয়পুরহাট', division: 'Rajshahi', population: '1.0M', area: '965 km²', description: 'Agricultural rich district.', upazilas: ['Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'], touristspots: ['Nandail Dighi'] },

  // KHULNA DIVISION (10)
  { id: 'khulna', nameen: 'Khulna', namebn: 'খুলনা', division: 'Khulna', population: '2.6M', area: '4,394 km²', description: 'Gateway to Sundarbans.', upazilas: ['Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Phultala', 'Rupa', 'Terokhada'], touristspots: ['Sundarbans'] },
  { id: 'jessore', nameen: 'Jessore', namebn: 'যশোর', division: 'Khulna', population: '3.0M', area: '2,570 km²', description: 'First independent district.', upazilas: ['Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'], touristspots: ['Gadkhali'] },
  { id: 'satkhira', nameen: 'Satkhira', namebn: 'সাতক্ষীরা', division: 'Khulna', population: '2.2M', area: '3,858 km²', description: 'Coastal district.', upazilas: ['Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala'], touristspots: ['Kalagachia'] },
  { id: 'bagerhat', nameen: 'Bagerhat', namebn: 'বাগেরহাট', division: 'Khulna', population: '1.6M', area: '3,959 km²', description: 'Sixty Dome Mosque city.', upazilas: ['Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'], touristspots: ['Shat Gombuj Masjid'] },
  { id: 'kushtia', nameen: 'Kushtia', namebn: 'কুষ্টিয়া', division: 'Khulna', population: '2.1M', area: '1,601 km²', description: 'Cultural capital, Lalon land.', upazilas: ['Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur'], touristspots: ['Lalon Shah Mazar'] },
  { id: 'jhenaidah', nameen: 'Jhenaidah', namebn: 'ঝিনাইদহ', division: 'Khulna', population: '2.0M', area: '1,949 km²', description: 'City of flowers.', upazilas: ['Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'], touristspots: ['Johor Dighi'] },
  { id: 'magura', nameen: 'Magura', namebn: 'মাগুরা', division: 'Khulna', population: '1.0M', area: '1,048 km²', description: 'Small but historic.', upazilas: ['Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'], touristspots: ['Sreepur Rajbari'] },
  { id: 'meherpur', nameen: 'Meherpur', namebn: 'মেহেরপুর', division: 'Khulna', population: '0.7M', area: '716 km²', description: 'First govt formed here.', upazilas: ['Sadar', 'Gangni', 'Mujibnagar'], touristspots: ['Mujibnagar Memorial'] },
  { id: 'narail', nameen: 'Narail', namebn: 'নড়াইল', division: 'Khulna', population: '0.8M', area: '990 km²', description: 'SM Sultan birth land.', upazilas: ['Sadar', 'Kalia', 'Lohagara'], touristspots: ['SM Sultan Complex'] },
  { id: 'chuadanga', nameen: 'Chuadanga', namebn: 'চুয়াডাঙ্গা', division: 'Khulna', population: '1.2M', area: '1,177 km²', description: 'First railway in BD.', upazilas: ['Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'], touristspots: ['Police Park'] },

  // BARISAL DIVISION (6)
  { id: 'barisal', nameen: 'Barisal', namebn: 'বরিশাল', division: 'Barisal', population: '2.5M', area: '2,785 km²', description: 'Venice of Bengal.', upazilas: ['Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'], touristspots: ['Guthia Mosque'] },
  { id: 'patuakhali', nameen: 'Patuakhali', namebn: 'পটুয়াখালী', division: 'Barisal', population: '1.7M', area: '3,220 km²', description: 'Gateway to Kuakata Beach.', upazilas: ['Sadar', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali', 'Dumki'], touristspots: ['Kuakata'] },
  { id: 'bhola', nameen: 'Bhola', namebn: 'ভোলা', division: 'Barisal', population: '2.0M', area: '3,403 km²', description: 'Largest island of BD.', upazilas: ['Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'], touristspots: ['Monpura Island'] },
  { id: 'pirozpur', nameen: 'Pirojpur', namebn: 'পিরোজপুর', division: 'Barisal', population: '1.2M', area: '1,307 km²', description: 'Coconut rich land.', upazilas: ['Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Zianagar'], touristspots: ['Backwaters'] },
  { id: 'barguna', nameen: 'Barguna', namebn: 'বরগুনা', division: 'Barisal', population: '1.0M', area: '1,831 km²', description: 'Coastal and forest beauty.', upazilas: ['Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali'], touristspots: ['Haringhata'] },
  { id: 'jhalokati', nameen: 'Jhalokati', namebn: 'ঝালকাঠি', division: 'Barisal', population: '0.7M', area: '758 km²', description: 'Floating guava market.', upazilas: ['Sadar', 'Kathalia', 'Nalchity', 'Rajapur'], touristspots: ['Floating Market'] },

  // SYLHET DIVISION (4)
  { id: 'sylhet', nameen: 'Sylhet', namebn: 'সিলেট', division: 'Sylhet', population: '3.9M', area: '3,452 km²', description: 'Tea gardens and shrines.', upazilas: ['Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Zakiganj', 'Dakshin Surma'], touristspots: ['Jaflong', 'Ratargul'] },
  { id: 'moulvibazar', nameen: 'Moulvibazar', namebn: 'মৌলভীবাজার', division: 'Sylhet', population: '2.1M', area: '2,799 km²', description: 'Tea capital of BD.', upazilas: ['Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'], touristspots: ['Lawachara'] },
  { id: 'sunamganj', nameen: 'Sunamganj', namebn: 'সুনামগঞ্জ', division: 'Sylhet', population: '2.8M', area: '3,669 km²', description: 'Land of Haors.', upazilas: ['Sadar', 'Bishwamvapur', 'Chhatak', 'Derai', 'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Sullah', 'Tahirpur', 'Dakshin Sunamganj'], touristspots: ['Tanguar Haor'] },
  { id: 'habiganj', nameen: 'Habiganj', namebn: 'হবিগঞ্জ', division: 'Sylhet', population: '2.3M', area: '2,636 km²', description: 'Rich in natural gas.', upazilas: ['Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Sayestaganj'], touristspots: ['Satchari'] },

  // RANGPUR DIVISION (8)
  { id: 'rangpur', nameen: 'Rangpur', namebn: 'রংপুর', division: 'Rangpur', population: '3.1M', area: '2,307 km²', description: 'Historic northern city.', upazilas: ['Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'], touristspots: ['Tajhat Palace'] },
  { id: 'dinajpur', nameen: 'Dinajpur', namebn: 'দিনাজপুর', division: 'Rangpur', population: '3.3M', area: '3,438 km²', description: 'Rice and Lychee hub.', upazilas: ['Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Phulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'], touristspots: ['Kantajew Temple'] },
  { id: 'gaibandha', nameen: 'Gaibandha', namebn: 'গাইবান্ধা', division: 'Rangpur', population: '2.6M', area: '2,179 km²', description: 'River-centric district.', upazilas: ['Sadar', 'Phulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'], touristspots: ['Balashi Ghat'] },
  { id: 'kurigram', nameen: 'Kurigram', namebn: 'কুড়িগ্রাম', division: 'Rangpur', population: '2.3M', area: '2,296 km²', description: 'Chhar region district.', upazilas: ['Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raumari', 'Ulipur'], touristspots: ['Dharla Bridge'] },
  { id: 'nilphamari', nameen: 'Nilphamari', namebn: 'নীলফামারী', division: 'Rangpur', population: '2.0M', area: '1,580 km²', description: 'Blue land (Nil).', upazilas: ['Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Saidpur'], touristspots: ['Teesta Barrage'] },
  { id: 'panchagarh', nameen: 'Panchagarh', namebn: 'পঞ্চগড়', division: 'Rangpur', population: '1.1M', area: '1,404 km²', description: 'Northernmost tip of BD.', upazilas: ['Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'], touristspots: ['Tetulia'] },
  { id: 'thakurgaon', nameen: 'Thakurgaon', namebn: 'ঠাকুরগাঁও', division: 'Rangpur', population: '1.5M', area: '1,809 km²', description: 'Peaceful border land.', upazilas: ['Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'], touristspots: ['Mango Tree'] },
  { id: 'lalmonirhat', nameen: 'Lalmonirhat', namebn: 'লালমনিরহাট', division: 'Rangpur', population: '1.4M', area: '1,241 km²', description: 'Enclave history.', upazilas: ['Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'], touristspots: ['Tin Bigha'] },

  // MYMENSINGH DIVISION (4)
  { id: 'mymensingh', nameen: 'Mymensingh', namebn: 'ময়মনসিংহ', division: 'Mymensingh', population: '5.8M', area: '4,363 km²', description: 'Cultural and edu hub.', upazilas: ['Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagacha', 'Nandail', 'Phulpur', 'Trishal', 'Tara Khanda'], touristspots: ['Shashi Lodge'] },
  { id: 'netrokona', nameen: 'Netrokona', namebn: 'নেত্রকোনা', division: 'Mymensingh', population: '2.5M', area: '2,810 km²', description: 'Hills and culture.', upazilas: ['Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Khaliajuri', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala'], touristspots: ['Birishiri'] },
  { id: 'jamalpur', nameen: 'Jamalpur', namebn: 'জামালপুর', division: 'Mymensingh', population: '2.5M', area: '2,031 km²', description: 'Famous for Nakshi Kantha.', upazilas: ['Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Melandah', 'Sarishabari'], touristspots: ['Lauk Chapra'] },
  { id: 'sherpur', nameen: 'Sherpur', namebn: 'শেরপুর', division: 'Mymensingh', population: '1.5M', area: '1,363 km²', description: 'Garo hills beauty.', upazilas: ['Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'], touristspots: ['Ghazni Abakash'] }
];

const MOCK_JOBS = [
  { id: 1, title: 'Assistant Teacher', company: 'Dhaka Govt High School', type: 'Full Time', location: 'Dhaka', salary: '25k-35k', deadline: '2023-12-31', category: 'Government', description: 'Teaching position for Science subjects.', postedBy: 'Admin', postedDate: '10/24/2023', status: 'Active', views: 120, level: 'Entry' },
  { id: 2, title: 'Sales Executive', company: 'Pran RFL', type: 'Full Time', location: 'Chittagong', salary: '15k-20k', deadline: '2023-11-20', category: 'Private', description: 'Field sales executive needed.', postedBy: 'Admin', postedDate: '10/25/2023', status: 'Active', views: 85, level: 'Entry' }
];

const MOCK_BLOGS = [
  { id: 1, title: 'Modern Rice Farming', category: 'Agriculture', author: 'Dr. Rahim', date: 'Oct 20, 2023', postedDate: '10/20/2023', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff', content: 'Using technology in rice farming increases yield...', readTime: '5 min read', status: 'Active', views: 200, excerpt: 'Using technology in rice farming increases yield...' },
  { id: 2, title: 'Winter Health Tips', category: 'Health', author: 'Dr. Samia', date: 'Oct 22, 2023', postedDate: '10/22/2023', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d', content: 'Stay warm and drink plenty of water...', readTime: '3 min read', status: 'Active', views: 150, excerpt: 'Stay warm and drink plenty of water...' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'Rahim Uddin', email: 'demo@dreambd.com', password: 'demo', role: 'Citizen', phone: '01700000000', location: 'Dhaka', status: 'Active', date: '10/01/2023', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'u2', name: 'Admin User', email: 'admin@dreambd.com', password: 'admin123', role: 'Admin', phone: '01800000000', location: 'HQ', status: 'Active', date: '01/01/2023', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' }
];

const DataContext = createContext<any>(null);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [blogRequests, setBlogRequests] = useState<any[]>([]);
  const [wholesaleRequests, setWholesaleRequests] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleAds, setWholesaleAds] = useState<any[]>([]);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [vocationalCourses, setVocationalCourses] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [donorViewLogs, setDonorViewLogs] = useState<any[]>([]); // New State
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [totalVisitors, setTotalVisitors] = useState<number>(1250);

  const getLocal = (key: string, defaultData: any[]) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultData;
    } catch (e) { return defaultData; }
  };

  const setLocal = (key: string, data: any[]) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
  };

  const normalizeData = (data: any) => {
    if (!data || typeof data !== 'object') return data;
    const normalized: any = {};
    for (const key in data) {
      normalized[key.toLowerCase()] = data[key] === undefined ? null : data[key];
    }
    return normalized;
  };

  const mapFromDb = (item: any) => {
    if (!item) return item;
    const newItem = { ...item };
    const fieldMap: Record<string, string> = {
      'postedby': 'postedBy', 'posteddate': 'postedDate', 'readtime': 'readTime',
      'sellertype': 'sellerType', 'nameen': 'nameEn', 'namebn': 'nameBn',
      'titlebn': 'titleBn', 'lastdonation': 'lastDonation', 'enrolleddate': 'enrolledDate', 'user_name': 'user',
      'touristspots': 'touristSpots',
      'donor_name': 'donorName', 'donor_phone': 'donorPhone', 'viewer_name': 'viewerName', 'viewer_phone': 'viewerPhone', 'viewer_district': 'viewerDistrict'
    };
    Object.keys(fieldMap).forEach(dbKey => {
      if (dbKey in newItem) {
        newItem[fieldMap[dbKey]] = newItem[dbKey];
        if (dbKey !== fieldMap[dbKey]) delete newItem[dbKey];
      }
    });
    return newItem;
  };

  const fetchTable = async (table: string, setter: any, orderBy = 'created_at', ascending = false) => {
    if (!isSupabaseConfigured) return;
    try {
        const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
        if (!error && data) setter(data.map(mapFromDb));
    } catch(e) {}
  };

  const fetchData = async () => {
    setJobs(getLocal('db_jobs', MOCK_JOBS));
    setBlogs(getLocal('db_blogs', MOCK_BLOGS));
    setRequests(getLocal('db_requests', []));
    setBlogRequests(getLocal('db_blog_requests', []));
    setWholesaleRequests(getLocal('db_wholesale_requests', []));
    setGrievances(getLocal('db_grievances', []));
    setUsers(getLocal('db_users', MOCK_USERS));
    setMessages(getLocal('db_messages', []));
    setDistricts(getLocal('db_districts', INITIAL_DISTRICT_LIST));
    setDonorViewLogs(getLocal('db_donor_logs', []));
    
    if (isSupabaseConfigured) {
      await Promise.all([
        fetchTable('jobs', setJobs),
        fetchTable('blogs', setBlogs),
        fetchTable('requests', setRequests),
        fetchTable('blog_requests', setBlogRequests),
        fetchTable('wholesale_requests', setWholesaleRequests),
        fetchTable('grievances', setGrievances),
        fetchTable('users', setUsers),
        fetchTable('contact_messages', setMessages),
        fetchTable('market_prices', setMarketPrices),
        fetchTable('retail_products', setRetailProducts),
        fetchTable('wholesale_ads', setWholesaleAds),
        fetchTable('lawyers', setLawyers),
        fetchTable('exchange_rates', setExchangeRates),
        fetchTable('vocational_courses', setVocationalCourses),
        fetchTable('donors', setDonors),
        fetchTable('donor_view_logs', setDonorViewLogs),
        fetchTable('enrolled_courses', setEnrolledCourses),
        fetchTable('districts', setDistricts, 'nameen', true)
      ]);
    }
  };

  useEffect(() => {
    fetchData();
    if (isSupabaseConfigured) {
        const channel = supabase.channel('realtime_data')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData())
        .subscribe();
        return () => { supabase.removeChannel(channel); };
    }
  }, []);

  const optimisticAdd = async (table: string, newItem: any, setter: any, currentList: any[]) => {
    const tempItem = { ...newItem, id: Date.now() };
    const newList = [tempItem, ...currentList];
    setter(newList);
    setLocal(`db_${table}`, newList);
    
    if (isSupabaseConfigured) {
        try {
            const payload = normalizeData(newItem);
            const { error } = await supabase.from(table).insert([payload]);
            if (!error) await fetchTable(table, setter);
        } catch (err) {}
    }
  };

  const addDonorViewLog = async (log: any) => await optimisticAdd('donor_view_logs', log, setDonorViewLogs, donorViewLogs);

  const addRequest = async (request: any) => {
    const { contentType, ...dbData } = request;
    let table = 'requests';
    let setter = setRequests;
    let current = requests;

    if (contentType === 'blog') { table = 'blog_requests'; setter = setBlogRequests; current = blogRequests; }
    else if (contentType === 'wholesale') { table = 'wholesale_requests'; setter = setWholesaleRequests; current = wholesaleRequests; }
    
    const newReq = { ...dbData, status: 'Pending', postedDate: dbData.postedDate || new Date().toLocaleDateString() };
    await optimisticAdd(table, newReq, setter, current);
  };

  const handleRequestAction = async (item: any, action: 'approve' | 'reject', type: 'job' | 'blog' | 'wholesale') => {
    let table = 'requests';
    if (type === 'blog') { table = 'blog_requests'; setBlogRequests(blogRequests.filter(r => r.id !== item.id)); }
    else if (type === 'wholesale') { table = 'wholesale_requests'; setWholesaleRequests(wholesaleRequests.filter(r => r.id !== item.id)); }
    else { setRequests(requests.filter(r => r.id !== item.id)); }
    
    if (isSupabaseConfigured) await supabase.from(table).delete().eq('id', item.id);

    if (action === 'approve') {
      const { id, created_at, ...rest } = item;
      if (type === 'job') await optimisticAdd('jobs', { ...rest, status: 'Active' }, setJobs, jobs);
      else if (type === 'blog') await optimisticAdd('blogs', { ...rest, status: 'Active' }, setBlogs, blogs);
      else if (type === 'wholesale') await optimisticAdd('wholesale_ads', { ...rest, status: 'Active' }, setWholesaleAds, wholesaleAds);
    }
  };

  const addJob = async (job: any) => await optimisticAdd('jobs', { ...job, postedDate: new Date().toLocaleDateString(), status: 'Active' }, setJobs, jobs);
  const updateJob = async (item: any) => { setJobs(jobs.map(j => j.id === item.id ? item : j)); if (isSupabaseConfigured) await supabase.from('jobs').update(normalizeData(item)).eq('id', item.id); };
  const deleteJob = async (id: number) => { setJobs(jobs.filter(j => j.id !== id)); if (isSupabaseConfigured) await supabase.from('jobs').delete().eq('id', id); };
  const addBlog = async (blog: any) => await optimisticAdd('blogs', { ...blog, postedDate: new Date().toLocaleDateString(), status: 'Active' }, setBlogs, blogs);
  const updateBlog = async (item: any) => { setBlogs(blogs.map(b => b.id === item.id ? item : b)); if (isSupabaseConfigured) await supabase.from('blogs').update(normalizeData(item)).eq('id', item.id); };
  const deleteBlog = async (id: number) => { setBlogs(blogs.filter(b => b.id !== id)); if (isSupabaseConfigured) await supabase.from('blogs').delete().eq('id', id); };
  const addGrievance = async (g: any) => await optimisticAdd('grievances', { ...g, status: 'Pending', date: new Date().toLocaleDateString() }, setGrievances, grievances);
  const updateGrievanceStatus = async (id: number, status: string) => { setGrievances(grievances.map(g => g.id === id ? { ...g, status } : g)); if (isSupabaseConfigured) await supabase.from('grievances').update({ status }).eq('id', id); };
  const deleteGrievance = async (id: number) => { setGrievances(grievances.filter(g => g.id !== id)); if (isSupabaseConfigured) await supabase.from('grievances').delete().eq('id', id); };
  
  const addUser = async (u: any) => await optimisticAdd('users', u, setUsers, users);
  const deleteUser = async (id: string) => { setUsers(users.filter(u => u.id !== id)); if (isSupabaseConfigured) await supabase.from('users').delete().eq('id', id); };
  const updateUserStatus = async (id: string, status: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    if (isSupabaseConfigured) await supabase.from('users').update({ status }).eq('id', id);
  };
  const resetPassword = async (email: string, pw: string) => { const u = users.find(u => u.email.toLowerCase() === email.toLowerCase()); if (u) { setUsers(users.map(us => us.id === u.id ? {...u, password: pw} : us)); if (isSupabaseConfigured) await supabase.from('users').update({ password: pw }).eq('id', u.id); } };
  
  const addMessage = async (m: any) => await optimisticAdd('contact_messages', m, setMessages, messages);
  const markMessageRead = async (id: number) => { setMessages(messages.map(m => m.id === id ? { ...m, status: 'Read' } : m)); if (isSupabaseConfigured) await supabase.from('contact_messages').update({ status: 'Read' }).eq('id', id); };
  const deleteMessage = async (id: number) => { setMessages(messages.filter(m => m.id !== id)); if (isSupabaseConfigured) await supabase.from('contact_messages').delete().eq('id', id); };
  const updateMarketPrices = async (p: any[]) => setMarketPrices(p);
  const addRetailProduct = async (p: any) => await optimisticAdd('retail_products', p, setRetailProducts, retailProducts);
  const updateRetailProduct = async (p: any) => { setRetailProducts(retailProducts.map(pr => pr.id === p.id ? p : pr)); if (isSupabaseConfigured) await supabase.from('retail_products').update(normalizeData(p)).eq('id', p.id); };
  const deleteRetailProduct = async (id: number) => { setRetailProducts(retailProducts.filter(p => p.id !== id)); if (isSupabaseConfigured) await supabase.from('retail_products').delete().eq('id', id); };
  const addWholesaleAd = async (a: any) => await optimisticAdd('wholesale_ads', a, setWholesaleAds, wholesaleAds);
  const updateWholesaleAd = async (a: any) => { setWholesaleAds(wholesaleAds.map(ad => ad.id === a.id ? a : ad)); if (isSupabaseConfigured) await supabase.from('wholesale_ads').update(normalizeData(a)).eq('id', a.id); };
  const deleteWholesaleAd = async (id: number) => { setWholesaleAds(wholesaleAds.filter(a => a.id !== id)); if (isSupabaseConfigured) await supabase.from('wholesale_ads').delete().eq('id', id); };
  const addLawyer = async (l: any) => await optimisticAdd('lawyers', l, setLawyers, lawyers);
  const deleteLawyer = async (id: number) => { setLawyers(lawyers.filter(l => l.id !== id)); if (isSupabaseConfigured) await supabase.from('lawyers').delete().eq('id', id); };
  const addExchangeRate = async (r: any) => await optimisticAdd('exchange_rates', r, setExchangeRates, exchangeRates);
  const deleteExchangeRate = async (id: number) => { setExchangeRates(exchangeRates.filter(r => r.id !== id)); if (isSupabaseConfigured) await supabase.from('exchange_rates').delete().eq('id', id); };
  const addVocationalCourse = async (c: any) => await optimisticAdd('vocational_courses', c, setVocationalCourses, vocationalCourses);
  const deleteVocationalCourse = async (id: number) => { setVocationalCourses(vocationalCourses.filter(c => c.id !== id)); if (isSupabaseConfigured) await supabase.from('vocational_courses').delete().eq('id', id); };
  const enrollCourse = async (c: any) => await optimisticAdd('enrolled_courses', c, setEnrolledCourses, enrolledCourses);
  const addDonor = async (d: any) => await optimisticAdd('donors', d, setDonors, donors);
  
  const updateDistrict = async (d: any) => {
    const newList = districts.map(item => item.id === d.id ? d : item);
    setDistricts(newList);
    setLocal('db_districts', newList);
    if (isSupabaseConfigured) {
        const payload = normalizeData(d);
        await supabase.from('districts').upsert([payload], { onConflict: 'id' });
    }
  };

  const seedDistricts = async () => {
    if (!isSupabaseConfigured) {
      alert("Database not connected. Connect Supabase first in Admin Panel.");
      return;
    }
    try {
      // Chunking for reliability (though 64 items is usually fine in one request)
      const payload = INITIAL_DISTRICT_LIST.map(d => normalizeData(d));
      const { error } = await supabase.from('districts').upsert(payload, { onConflict: 'id' });
      
      if (error) throw error;
      
      alert("Success! All 64 Districts have been seeded to your Supabase database.");
      await fetchTable('districts', setDistricts, 'nameen', true);
    } catch (err: any) {
      console.error(err);
      alert("Error seeding districts: " + err.message);
    }
  };

  return (
    <DataContext.Provider value={{ 
      jobs, blogs, requests, blogRequests, wholesaleRequests, grievances, users, messages, donors, donorViewLogs, marketPrices, retailProducts, wholesaleAds, lawyers, exchangeRates, vocationalCourses, enrolledCourses, districts,
      addJob, updateJob, deleteJob, addBlog, updateBlog, deleteBlog, addRequest, handleRequestAction, addGrievance, updateGrievanceStatus, deleteGrievance, addUser, deleteUser, updateUserStatus, resetPassword, addMessage, markMessageRead, deleteMessage, updateMarketPrices, addRetailProduct, updateRetailProduct, deleteRetailProduct, addWholesaleAd, updateWholesaleAd, deleteWholesaleAd, addLawyer, deleteLawyer, addExchangeRate, deleteExchangeRate, addVocationalCourse, deleteVocationalCourse, enrollCourse, addDonor, addDonorViewLog, updateDistrict, seedDistricts,
      totalVisitors, logVisit: () => {}, refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
