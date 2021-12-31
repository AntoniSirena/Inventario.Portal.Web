import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  coreURL;

  constructor(private httpClient: HttpClient) { 
    this.coreURL = environment.coreURL;
  }

  getPersonTypes():Observable<object>{    
    return this.httpClient.get(this.coreURL +'api/common/GetPesonTypes');
  }

  getDocumentTypes():Observable<object>{    
    return this.httpClient.get(this.coreURL +'api/common/GetDocumentTypes');
  }

  getCurrentUserInfo(id: number):Observable<object>{    
    return this.httpClient.get(this.coreURL +'api/common/GetCurrentUserInfo/' + id);
  }

  getUserTypes():Observable<object>{    
    return this.httpClient.get(this.coreURL +'api/external/GetUserTypes');
  }

  getConfigurationParameter(name: string):Observable<object>{ 
    return this.httpClient.get(this.coreURL +`api/common/GetConfigurationParameter?name=${name}`);
  }
  
}
