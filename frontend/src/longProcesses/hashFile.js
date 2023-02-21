import md5 from 'md5';

self.onmessage = (e) => {
  const file = e.data;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const buffer = e.target.result;
    console.log(buffer);
    const hash = md5(buffer);
    self.postMessage(hash);
    self.close();
  };
};

export {};
