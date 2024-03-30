"use client";

import React, { useEffect, useState } from "react";
import ContributorInterface from "../interfaces/ContributorInterface";
import ContributorCard from "../components/ContributorCard";
import Header from "../components/Header";

const contributors = [
  "stzheng716",
  "MGHermanMancarella",
  "CodingHobo",
  "camrandev",
  "mtbocim",
  "hbnnguyen",
  "ggzzyy16",
];

const linkedInLinks = [
  'https://www.linkedin.com/in/steven-h-zheng/',
  'https://www.linkedin.com/in/michael-g-herman/',
  'https://www.linkedin.com/in/tanyashylock/',
  'https://www.linkedin.com/in/camranrynowecer/',
  'https://www.linkedin.com/in/michaelbocim/',
  'https://www.linkedin.com/in/hbnnguyen/',
  'https://www.linkedin.com/in/ggzzyy16/',
]

export default function Devs() {
  const [contribData, setContribData] = useState<ContributorInterface[]>([]);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const responses = await Promise.all(
          contributors.map(username =>
            fetch(`https://api.github.com/users/${username}`)
          )
        );
        const data = await Promise.all(
          responses.map(res => res.json())
        ) as ContributorInterface[];
        setContribData(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    }

    fetchContributors();
  }, []);

  return (
    <>
    <Header pageName="Devs" />
    <div className="p-2">

        <div className="grid
                        grid-cols-1
                        sm:grid-cols-1
                        m:grid-cols-2
                        lg:grid-cols-2
                        xl:grid-cols-3
                        gap-6">
        {contribData.map((contributor, index) => (
            <ContributorCard key={contributor.login} contributorData={contributor} linkedInUrl={linkedInLinks[index]} />
          ))}
      </div>
      </div>
      </>
  );
}