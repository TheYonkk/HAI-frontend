import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import styles from "./index.module.scss";
import { Button } from "@mui/material";
import Link from "next/link";

// used by other pages and passed in as [id] in the lesson page
export const lessonList = ["A", "B", "F"];

export default function Home() {

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.mainContainer}>
        <section className={styles.headerContainer}>
          <h1>Talk to the hand!</h1>
          <p>Learn to sign with your hands</p>
        </section>

        <section className={styles.lessonContainer}>
          {lessonList.map((lesson, index) => {
            return (
              <section className={styles.buttonContainer}>
                <Button
                  variant="contained"
                  sx={{ width: "10rem", height: "5rem", borderRadius: "1rem" }}
                  href={"/lessons/" + lesson}
                >
                  {lesson}
                </Button>
              </section>
            );
          })}
        </section>
      </section>
    </>
  );
}
