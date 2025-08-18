// src/app/organization-list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@/components";
import {
  getAllOrganizations,
  getAllCategories,
  getAllCities,
  getFilteredOrganizations,
} from "@/lib/api";
import { Organization, Category, City } from "@/entities/organization.entity";

export default function OrganizationListPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isOutdoor, setIsOutdoor] = useState("");

  useEffect(() => {
    getAllCategories().then(setCategories);
    getAllCities().then(setCities);
    getAllOrganizations().then(setOrganizations);
  }, []);

  const handleFilter = () => {
    const filters = {
      categoryId: selectedCategory || undefined,
      cityId: selectedCity || undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      isOutdoor: isOutdoor === "" ? undefined : isOutdoor === "true",
    };
    getFilteredOrganizations(filters).then(setOrganizations);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
          Organizasyonlar
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150 ease-in-out"
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150 ease-in-out"
          >
            <option value="">Şehir Seçin</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.cityName}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Max Fiyat"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150 ease-in-out"
          />

          <select
            value={isOutdoor}
            onChange={(e) => setIsOutdoor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150 ease-in-out"
          >
            <option value="">Mekan Türü</option>
            <option value="true">Dış Mekan</option>
            <option value="false">İç Mekan</option>
          </select>

          <button
            onClick={handleFilter}
            className="col-span-1 md:col-span-4 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 duration-300 ease-in-out"
          >
            Filtrele
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizations.map((org) => (
            <Link key={org.id} href={`/organization-detail/${org.id}`}>
              <div className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105">
                <img
                  src={`http://localhost:5268${org.coverPhotoPath}`}
                  alt={org.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{org.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">{org.duration}</p>
                  <p className="text-pink-600 font-bold">
                    {org.price.toLocaleString()} TL
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
