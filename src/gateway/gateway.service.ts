import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);

  // 定义上游服务映射
  private readonly upstreamServices = {};

  constructor(private readonly httpService: HttpService) {}

  // todo
}
