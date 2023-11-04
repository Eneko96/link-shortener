import { useState } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";

export default function Home() {
  const [result, setResult] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = event.target.url.value;
    const response = await fetch(`api/shortenLink?link=${url}`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const { hash } = await response.json();
    setResult([...result, `http://localhost:3000/api/goTo?hash=${hash}`]);
  };

  return (
    <Layout home>
      <Head>
        <title>ShortEneko</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Shorten the link</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" id="url" name="url" />
          <button type="submit">Shorten</button>
        </form>
      </section>
      <section className={utilStyles.headingMd}>
        <h2>Shortened links</h2>
        <ul className={utilStyles.list}>
          <li>Link 1</li>
          {result.map((link) => (
            <li>
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
