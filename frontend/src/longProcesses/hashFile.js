import SparkMD5 from 'spark-md5';

const spark = new SparkMD5();
self.onmessage = (e) => {
  const chunkList = e.data;

  chunkList.forEach((chunk) => {
    spark.append(chunk);
  });

  const hash = spark.end();
  self.postMessage(hash);
  self.close();
};

export {};
