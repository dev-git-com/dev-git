"use client";

import AppGeneratorForm from "@/shared/components/AppGeneratorForm";

const Home = () => {
  return (
    <div className="container px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 uppercase">
        Generate FULL APP using YOUR INPUTS!
      </h1>
      {/* <h3>{"This system will generate a full-stack application using user inputs! (focused in backend generation)"}</h3>
      {"Select database type (SQL/No-SQL)"}
      {"Select Database (PostgreSQL, MongoDB, MySQL, etc.)"}
      {"Choose Backend Framework (NestJS, FastAPI, etc.)"}
      {"Select Authentication (JWT, OAuth, etc.)"}
      {"Add file management using FTP access! - (.env)"}
      {"Add Logger & Error Logger!"}
      {"Add Caching using Redis! - (.env)"}
      {"Add Search Engine using (ElasticSearch, MeiliSearch)!"}
      {"The app will use Local Time server!"}
      {"Select your Date Format!"}
      {"Add AdminJS!"}
      {"Generate Admin Panel for all the APIs!"}
      {"Add Payment methods with your configration! - (.env)"}
      {"Add GraphQL for all the project!"}
      {"Add i18/localization!"}
      {"Config Rate Limiting!"}
      {"Pagination & Lazy Loading Service to use it in your code!"}
      {"Real-Time/Notifications/Chatting (WebSockets, SSE, FCM, etc.)!"}
      {"Configure your Entities & Relations!"}
      <p>{"Add your .env"}</p>
      <p>{"Select your Frontend template! (optional)"}</p>
      <button>Generate Your App!</button> */}

      {/* //! change it */}
      <AppGeneratorForm />
    </div>
  );
};

export default Home;
