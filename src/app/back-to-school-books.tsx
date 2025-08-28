// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { getAllCategories, getFeaturedOrganizations } from "@/lib/api";
import { useRouter } from "next/navigation";

function OrganizationCard({
  id,
  img,
  title,
  desc,
}: {
  id: string;
  img: string;
  title: string;
  desc: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/organization-detail/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}

export function BackToSchoolBooks() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const categories = await getAllCategories();
      setTabs(categories || []);
      if (categories?.length) {
        const defaultCategory = categories[0];
        setActiveTab(defaultCategory.name);
        fetchFeatured(defaultCategory.id);
      }
    })();
  }, []);

  const fetchFeatured = (categoryId: number) => {
    getFeaturedOrganizations(categoryId).then((res) => setCards(res));
  };

  const handleTabClick = (tab: { id: number; name: string }) => {
    setActiveTab(tab.name);
    fetchFeatured(tab.id);
  };

  return (
    <section className="bg-gray-50 px-4 md:px-10 py-20">
      <div className="text-center mb-12">
        <Typography variant="h2" className="text-gray-800 font-bold text-3xl md:text-4xl mb-4">
          Organizasyon Kategorileri
        </Typography>
        <Typography variant="lead" className="text-gray-600">
          Size en uygun organizasyonları keşfedin. Şehirdeki fırsatları kaçırmayın!
        </Typography>
      </div>

      {tabs.length > 0 && activeTab && (
        <div className="flex justify-center mb-10">
          <Tabs value={activeTab} className="w-full lg:w-8/12">
            <TabsHeader
              className="h-auto bg-white p-2 shadow-md rounded-xl flex-wrap justify-center"
              indicatorProps={{
                className: "bg-pink-500/10 rounded-md",
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <Tab
                    key={tab.id}
                    value={tab.name}
                    onClick={() => handleTabClick(tab)}
                    className={`px-4 py-2 m-1 rounded-lg transition-all duration-300
                      ${isActive ? "bg-pink-100 text-pink-700 font-semibold" : "text-gray-800 hover:bg-gray-100"}
                    `}
                  >
                    {tab.name}
                  </Tab>
                );
              })}
            </TabsHeader>
          </Tabs>
        </div>
      )}

      {/* Kartlar */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {cards.length > 0 ? (
          cards.map((org, key) => (
            <OrganizationCard
              key={key}
              id={org.id}
              img={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${org.coverPhotoPath}`}
              title={org.title}
              desc={(org.description || "").slice(0, 100) + "..."}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full mt-10">Henüz organizasyon bulunamadı.</p>
        )}
      </div>
    </section>
  );
}

export default BackToSchoolBooks;
