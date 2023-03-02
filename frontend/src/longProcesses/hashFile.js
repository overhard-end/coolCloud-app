import SparkMD5 from 'spark-md5';

const spark = new SparkMD5();
self.onmessage = (e) => {
  const chunkList = e.data;

  chunkList.forEach((chunk, index) => {
    spark.append(chunk);
    const progress = (index / chunkList.length) * 100;
    self.postMessage({ ready: false, progress: progress });
  });

  const hash = spark.end();
  self.postMessage({ hash: hash, ready: true });
  self.close();
};

export {};
