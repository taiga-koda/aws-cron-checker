import Head from 'next/head'
import styles from '../styles/Home.module.css'
import awsCronParser from "aws-cron-parser";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export declare type ParsedRule = (string | number)[];

type FormData = {
  expression: string
}

export default function Home() {
  const {
    register,
    watch
  } = useForm<FormData>();

  const [result, setResult] = useState('');
  const [next, setNext] = useState('');
  const input = watch('expression')

  useEffect(() => {
    try {
      const numberOfSpace = input.match(/ /g);
      if (numberOfSpace?.length! < 6) {
        const now = new Date();
        const cron = awsCronParser.parse(input);
        const schedule = awsCronParser.getScheduleDescription(cron);
        setResult(schedule);
        const occurrence = awsCronParser.next(cron, now)
        setNext(occurrence?.toUTCString()!);
      } else {
        setResult('');
      }
    } catch {
      setResult('');
      return;
    }
  }, [input]);

  return (
    <div className={styles.container}>
      <Head>
        <title>AWS Cron Checker</title>
        <meta name="description" content="Checking the aws cron expression" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.main_title}>AWS Cron Checker</h1>
        {result && <h2 className={styles.result}>{ result }</h2>}
        {result && next && <h3>next: { next }</h3>}
        <div>
          <input className={styles.input_field} {...register('expression')} placeholder="0 9 ? * 5 *"/>
        </div>
        <table className={styles.rule_table}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Values</th>
              <th>Wildcards</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Minutes</td>
              <td>0-59</td>
              <td>, - * /</td>
            </tr>
            <tr>
              <td>Hours</td>
              <td>0-23</td>
              <td>, - * /</td>
            </tr>
            <tr>
              <td>Day-of-month</td>
              <td>1-31</td>
              <td>, - * ? / L W</td>
            </tr>
            <tr>
              <td>Month</td>
              <td>1-12 or JAN-DEC</td>
              <td>, - * /</td>
            </tr>
            <tr>
              <td>Day-of-week</td>
              <td>1-7 or SUN-SAT</td>
              <td>, - * ? L #</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>1970-2199</td>
              <td>, - * /</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}
