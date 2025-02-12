
const initHeaders = () => {
  const options: RequestInit = {
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }
  return options;

}


export const put = async (url = "", data = {}) => {
  const options = initHeaders();
  const updatedOptions: RequestInit = {
    method: "PUT",
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetch(url, updatedOptions);
  handleErrors("put", response);
  return await response.json().then(handleCustomError);
};

export const post = async (url = "", data = {}) => {
  const options = initHeaders();
  const updatedOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  };
  const response = await fetch(url, updatedOptions);
  handleErrors("post", response);
  return await response.json().then(handleCustomError);
};

export const get = async (url = "", _data = {}) => {
  const options = initHeaders();
  const updatedOptions: RequestInit = {
    method: "GET",
    ...options,
  };
  const response = await fetch(url, updatedOptions);
  handleErrors("get", response);
  return await response.json().then(handleCustomError);
};

export const downloadFile = async (url = "", _data = {}) => {
  const options = initHeaders();
  const updatedOptions: RequestInit = {
    method: "GET",
    ...options,
  };
  const response = await fetch(url, updatedOptions);
  handleErrors("get", response);
  return await response;
};

export const purge = async (url = "", _data = {}) => {
  const options = initHeaders();
  const updatedOptions: RequestInit = {
    method: "DELETE",
    ...options,
  };
  const response = await fetch(url, updatedOptions);
  handleErrors("purge", response);
  return await Promise.resolve({});
};

function handleErrors(operation: string, response: Response) {
    if (!response.ok) {
    const message = `An error has occured ${operation} ${response.url} : ${response.status}`;
    
    // const err = {
    //   url:response.url,
    //   status: response.status,
    //   operation,
    //   errorMessage:response.statusText
    // };
    throw new Error(message);    
  } 
}
function handleCustomError (data: any) {
  if(data.customstatus && data.customstatus !==200){
    const message = `An error has occured ${data.customstatus} : ${data.message}`;
    // const err = {
    //   status: data.customstatus,
    //   errorMessage:data.message
    // };
    throw new Error(message);  
  }
  return data;
}
