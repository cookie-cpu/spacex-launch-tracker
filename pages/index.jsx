import * as React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen, faNewspaper, faRocket } from '@fortawesome/free-solid-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons'

export default function Home({ launches }) {

  console.log(
    'launches',
    // launches,
    launches[0].mission_name
  );

  const [clicked, setClicked] = React.useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };
  
  const renderedData = launches.map(launch => {
    return (
      
        <div key={launch.id}  className={styles.card} onClick={handleClick}>

            <h2>{launch.mission_name}</h2><img className={styles.patch} src={launch.links.mission_patch_small}></img>
              <p className={styles.left}><strong>Launch Date: </strong>{new Date(launch.launch_date_local).toLocaleDateString("en-ca")}</p>
              <p className={styles.left}><FontAwesomeIcon icon={faRocket}/> : {launch.rocket.rocket_name}</p>
            
            <sub>{launch.launch_site.site_name_long}</sub>

              {launch.details && <p className={clicked ? styles.details : styles.detailsmore}>{launch.details}</p>}

              <div className={styles.linkdiv}>
                  {launch.links.video_link && <a className={styles.links} href={launch.links.video_link} target="_blank"><FontAwesomeIcon icon={faYoutube}/></a>}
                  {launch.links.article_link && <a className={styles.links} href={launch.links.article_link} target="_blank"><FontAwesomeIcon icon={faNewspaper}/></a>}
                  
              </div>           
        </div>
      
    )
  });

  return (
    <div className={styles.container}>
        <Head>
          <title>SpaceX Launch Tracker</title>
          <meta name="description" content="Generated by create next app" />
        </Head>

        <main className={styles.main}>
            <h1 className={styles.title}>
            SpaceX Launch Tracker
            </h1>

            <p className={styles.description}>
              Latest SpaceX Launches
            </p>

            <div className={styles.grid}>
              {renderedData}
            </div>

        </main>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 20) {
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            flickr_images
            mission_patch_small
          }
          id
          rocket {
            rocket_name
          }
          details
        }
      }
      
    `
  })

  return {
    props: {
      launches: data.launchesPast
    }
  }
}