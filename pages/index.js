import { useState } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
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
    setResult([...result, `${process.env.BASE_URL}${hash}`]);
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
        <ul className={utilStyles.list}>
          <li>Link 1</li>
          {result.map((link) => (
            <li key={`link-${link}`}>
              <a target="_blank" href={link}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
