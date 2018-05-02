import axios from 'axios';
import { AxiosResponse } from 'axios';

export const postData = async (url: string, data: string): Promise<object | null> => {
    console.log('postData', url, data);
    let vem: AxiosResponse;
    try {
      vem = await axios.post(
          url,
          data
        );
    } catch (error) {
      console.log('Opa - Erro do axiose');      
      console.log(error);
      return null;
    }
    if (!(vem.status < 300)) {
      console.log('Opa - Erro no request do post pra delete');
      console.log(vem.status, vem.statusText);
      console.log(vem);
      return null;
    } 
    console.log(vem.data);
    return vem.data;    
};
  