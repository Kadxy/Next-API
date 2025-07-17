export enum InterfaceType {
  web, // 通用网页支付（会根据device判断，自动返回跳转url/二维码/小程序跳转url等）
  jump, // 跳转支付（仅会返回跳转url）
  jsapi, // JSAPI支付（小程序内支付使用，仅返回JSAPI参数，需传入sub_openid和sub_appid参数）
  app, // APP支付（iOS/安卓APP内支付使用，仅返回APP支付参数，或APP拉起微信小程序参数）
  scan, // 付款码支付（需传入auth_code参数，支付成功后返回订单信息）
  applet, // 小程序支付（微信小程序内使用，返回微信小程序插件参数或跳转小程序参数）
}

export enum DeviceType {
  pc, // 电脑浏览器（默认）
  mobile, // 手机浏览器
  qq, // 手机QQ内浏览器
  wechat, // 微信内浏览器
  alipay, // 支付宝客户端
}

export enum PayType {
  jump, // 返回支付跳转url
  html, // 返回html代码，用于支付跳转
  qrcode, // 返回支付二维码
  urlscheme, // 返回微信/支付宝小程序跳转url scheme
  jsapi, // 返回用于发起JSAPI支付的参数
  app, // 返回用于发起APP支付的参数
  scan, // 付款码支付成功,返回支付订单信息
  wxplugin, // 返回要拉起的微信小程序插件参数，
  wxapp, // 返回要拉起的微信小程序和路径，用于APP内拉起微信小程序支付
}

export enum PayStatus {
  unpaid = 0,
  paid = 1,
  refunded = 2,
  frozen = 3,
  preauth = 4,
}

export enum PaymentMethod {
  wechat, // 微信支付
  alipay, // 支付宝
  qqpay, // QQ钱包
}

/**
 * 创建订单请求参数
 */
export interface EpayCreateOrderRequest {
  /** 商户ID */
  pid: number;

  /** 接口类型 */
  method: InterfaceType;

  /** 设备类型，仅通用网页支付需要传 */
  device?: DeviceType;

  /** 支付方式 */
  type: PaymentMethod;

  /** 商户订单号 */
  out_trade_no: string;

  /** 服务器异步通知地址 */
  notify_url: string;

  /** 页面跳转通知地址 */
  return_url: string;

  /** 商品名称，超过127字节自动截取 */
  name: string;

  /** 商品金额，单位：元，最大2位小数 */
  money: string;

  /** 用户发起支付的IP地址 */
  clientip: string;

  /** 业务扩展参数，支付后原样返回 */
  param?: string;

  /** 被扫支付授权码，仅被扫支付需要传 */
  auth_code?: string;

  /** 用户Openid，仅JSAPI支付需要传 */
  sub_openid?: string;

  /** 公众号AppId，仅JSAPI支付需要传 */
  sub_appid?: string;

  /** 自定义通道ID，对应进件商户列表的ID，未进件请勿传 */
  channel_id?: number;

  /** 当前时间戳，10位整数，单位秒 */
  timestamp: string;

  /** 签名字符串 */
  sign: string;

  /** 签名类型，默认为RSA */
  sign_type: string;
}

/**
 * 创建订单响应参数
 */
export interface EpayCreateOrderResponse {
  /** 返回状态码，0为成功，其它值为失败 */
  code: 0 | number;

  /** 错误信息，失败时返回原因 */
  msg?: string;

  /** 平台内部的订单号 */
  trade_no?: string;

  /** 发起支付类型 */
  pay_type?: PayType;

  /** 发起支付参数，根据不同的发起支付类型，返回内容也不一样 */
  pay_info?: string;

  /** 当前时间戳，10位整数，单位秒 */
  timestamp?: string;

  /** 签名字符串，参考签名规则 */
  sign?: string;

  /** 签名类型，默认为RSA */
  sign_type?: string;
}

/**
 * 订单查询请求参数
 */
export interface EpayQueryOrderRequest {
  /** 商户ID */
  pid: number;

  /** 平台订单号，与商户订单号必传其一 */
  trade_no?: string;

  /** 商户订单号，与平台订单号必传其一 */
  out_trade_no?: string;

  /** 当前时间戳，10位整数，单位秒 */
  timestamp: string;

  /** 签名字符串 */
  sign: string;

  /** 签名类型，默认为RSA */
  sign_type: string;
}

/**
 * 订单查询响应参数
 */
export interface EpayQueryOrderResponse {
  /** 返回状态码，0为成功，其它值为失败 */
  code: 0 | number;

  /** 错误信息，失败时返回原因 */
  msg?: string;

  /** 平台订单号 */
  trade_no?: string;

  /** 商户订单号 */
  out_trade_no?: string;

  /** 接口订单号，微信支付宝返回的单号 */
  api_trade_no?: string;

  /** 支付方式 */
  type?: PayType;

  /** 支付状态，0未支付，1已支付，2已退款，3已冻结，4预授权 */
  status?: PayStatus;

  /** 商户ID */
  pid?: number;

  /** 订单创建时间 */
  addtime?: string;

  /** 订单完成时间，仅完成才返回 */
  endtime?: string;

  /** 商品名称 */
  name?: string;

  /** 商品金额 */
  money?: string;

  /** 已退款金额，仅部分退款情况才返回 */
  refundmoney?: string;

  /** 业务扩展参数 */
  param?: string;

  /** 支付用户标识，一般为openid */
  buyer?: string;

  /** 支付用户IP */
  clientip?: string;

  /** 当前时间戳，10位整数，单位秒 */
  timestamp?: string;

  /** 签名字符串 */
  sign?: string;

  /** 签名类型，默认为RSA */
  sign_type?: string;
}

/**
 * 支付结果通知参数（服务器异步通知、页面跳转通知）
 */
export interface EpayNotifyResult {
  /** 商户ID */
  pid: number;

  /** 平台订单号 */
  trade_no: string;

  /** 商户订单号 */
  out_trade_no: string;

  /** 接口订单号，微信支付宝返回的单号 */
  api_trade_no: string;

  /** 支付方式 */
  type: string;

  /** 交易状态，固定为TRADE_SUCCESS */
  trade_status: 'TRADE_SUCCESS' | string;

  /** 订单创建时间 */
  addtime: string;

  /** 订单完成时间，仅完成才返回 */
  endtime?: string;

  /** 商品名称 */
  name: string;

  /** 商品金额 */
  money: string;

  /** 业务扩展参数 */
  param?: string;

  /** 支付用户标识，一般为openid */
  buyer?: string;

  /** 当前时间戳，10位整数，单位秒 */
  timestamp: string;

  /** 签名字符串 */
  sign: string;

  /** 签名类型，默认为RSA */
  sign_type: string;

  /** 支付平台可能会增加回调字段，需支持扩展 */
  [key: string]: any;
}
