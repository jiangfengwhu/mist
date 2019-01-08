import * as SparkMD5 from 'spark-md5';
export const getMD5 = (file: File | Blob) => {
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = function (e: any) {
      spark.append(e.target.result); // Append array buffer
      const re = spark.end();
      resolve(re);
    };

    fileReader.onerror = function (e) {
      reject(e);
    };
    fileReader.readAsArrayBuffer(file.slice(0, file.size));
  });
};
