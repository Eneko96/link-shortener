import { useState } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSession, useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
const { NEXT_SUPABASE_URL, NEXT_SUPABASE_KEY } = process.env;

async function getData() {
  const session = await getSession();
  const supabase = createClient(NEXT_SUPABASE_URL, NEXT_SUPABASE_KEY);
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", session?.user?.id);
  if (error) {
    return {
      props: {
        data: [],
      },
    };
  }
  return data;
}

export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("this is the session", session);
  const data = await getData(session?.user);
  return {
    props: {
      data,
    },
  };
};

export default function Home() {
  const { data: session } = useSession();
  const [hasUrl, setHasUrl] = useState(false);
  const [result, setResult] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = event.target.url.value;
    const response = await fetch(`api/shortenLink?link=${url}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const { hash } = await response.json();
    const baseUrl = window.location.href;
    setResult([...result, `${baseUrl}${hash}`]);
  };

  const handleChange = (event) => {
    const url = event.target.value;
    const isUrl = url.match(/^(ftp|http|https):\/\/[^ "]+$/);
    if (isUrl) {
      setHasUrl(true);
    } else {
      setHasUrl(false);
    }
  };

  return (
    <Layout home>
      <Head>
        <title>ShortEneko</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Shorten the link</h2>
        <p>
          Since you're not signed in, this link will only last for 24 hours!!
        </p>
        <form onSubmit={handleSubmit} className={`${utilStyles.form}`}>
          <input
            className={`${utilStyles.input}`}
            type="text"
            id="url"
            name="url"
            onChange={handleChange}
          />
          <button
            className={`${utilStyles.submit}`}
            disabled={!hasUrl}
            type="submit"
          >
            Shorten
          </button>
        </form>
      </section>
      <section className={utilStyles.headingMd}>
        <h2>Shortened links</h2>
        {/* <ul className={utilStyles.list}>
          <li>Link 1</li>
          {result.map((link) => (
            <li key={`link-${link}`}>
              <a target="_blank" href={link}>
                {link}
              </a>
            </li>
          ))}*/}
      </section>
    </Layout>
  );
}
