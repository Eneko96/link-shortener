import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { useSession } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
const { NEXT_SUPABASE_URL, NEXT_SUPABASE_KEY } = process.env;

async function getData(user_id) {
  const supabase = createClient(NEXT_SUPABASE_URL, NEXT_SUPABASE_KEY);
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user_id);
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
  const data = await getData(session?.user?.email ?? "anon");
  return {
    props: {
      data,
      url: context.req.headers.host,
    },
  };
};

export default function Home({ data, url }) {
  const { data: session } = useSession();
  const [hasUrl, setHasUrl] = useState(false);
  const [result, setResult] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = event.target.url.value;
    const response = await fetch(
      `api/shortenLink?link=${url}&user_id=${session?.user?.email ?? "anon"}`,
    );
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
          <Input
            className={`${utilStyles.input}`}
            type="text"
            id="url"
            name="url"
            onChange={handleChange}
          />
          <Button disabled={!hasUrl} type="submit">
            Shorten
          </Button>
        </form>
      </section>
      <section className={utilStyles.headingMd}>
        <ScrollArea className="h-72 w-48 rounded-md border max-w-48">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Shortened links
            </h4>
            {data.map(({ hash, url: goTo }) => {
              return (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">
                      {url}/{hash}
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex flex-col items-center justify-center">
                      <p>to {goTo}</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
            {result.map((link) => (
              <a target="_blank" href={link}>
                {link}
              </a>
            ))}
          </div>
        </ScrollArea>
      </section>
    </Layout>
  );
}
