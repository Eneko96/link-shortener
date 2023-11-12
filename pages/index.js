import { useState, useEffect } from "react";
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
    setResult([...result, { hash }]);
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

  const handleRedirect = (event) => {
    const hash = event.target.dataset.redirect;
    window.open(hash, "_blank");
  };

  const handleOptions = (type, hash) => () => {
    if (type === "copy") {
      navigator.clipboard.writeText(`${url}/${hash}`);
    }
    if (type === "redirect") {
      window.open(hash, "_blank");
    }
  };

  useEffect(() => {
    const ls = localStorage.getItem("links");
    if (ls) {
      setResult(JSON.parse(ls));
    }
  }, []);

  return (
    <Layout home>
      <Head>
        <title>ShortEneko</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Shorten the link</h2>
        {!session && (
          <p>
            Since you're not signed in, this link will only last for 24 hours!!
          </p>
        )}
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
      {[...data, ...result].length > 0 && (
        <section className={utilStyles.headingMdlist}>
          <ScrollArea className="rounded-md border border-red">
            <div className="p-4">
              <h4 className="mb-4 text-center text-sm font-medium leading-none">
                Shortened links
              </h4>
              {[...data, ...result].map(({ hash }) => {
                return (
                  <div key={hash}>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="link"
                          data-redirect={hash}
                          onClick={handleRedirect}
                        >
                          {url}/{hash}
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="">
                        <div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium leading-none">
                              Link to
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              You didn't add any description
                            </p>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex h-5 items-center my-2 justify-around space-x-4 text-sm">
                            <Button
                              variant="link"
                              onClick={handleOptions("copy", hash)}
                            >
                              Copy
                            </Button>
                            <Separator orientation="vertical" />
                            <Button
                              variant="link"
                              onClick={handleOptions("redirect", hash)}
                            >
                              Redirect
                            </Button>
                          </div>
                        </div>{" "}
                      </HoverCardContent>
                    </HoverCard>
                    <Separator />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </section>
      )}
    </Layout>
  );
}
