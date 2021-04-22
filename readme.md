WebRTC源码目录结构
api             WebRTC接口层，浏览器都是通过该接口调用WebRTC
call            数据流的管理层，Call代表同一个端点的所有数据的流入流出
audio           与音频相关的逻辑
audio           与音频相关的逻辑
common_audio    音频算法相关
common_video    视频算法相关
media           与多媒体相关的逻辑处理，如编解码的逻辑处理
logging         日志相关
module          最重要的目录，子模块
pc              Peer connection,链接相关的逻辑层
p2p             端对端相关代码，stun，turn
rtc_base        基础代码，如线程、锁相关的统一接口代码
rtc_tool        音视频分析相关的工具代码
tool_webrtc     WebRTC测试相关的工具代码，如网络模拟器
system_wrappers 与具体操作系统相关的代码，如CPU特性，原子操作等
stats           存放各种数据统计相关的类
sdk             存放Android和IOS层代码，如视频的采集，渲染等

WebRTC Modules目录结构
audio_coding            音频编解码相关代码
audio_device            音频采集与音频播放相关代码
audio_mixer             混音相关代码
audio_processing        音频前后处理的相关代码
bitrate_controller      码率控制相关代码
congestion_controller   流控相关代码
desktop_capture         桌面采集相关的代码
pacing                  码率探测及平滑处理相关的代码
remote_bitrate_estimator    远端码率估算相关的代码
rtp_rtcp                rtp/rtcp协议相关代码
video_capture           视频采集相关的代码
video_coding            视频编解码相关的代码
video_processing        视频前后处理相关的代码

https://192.168.1.105/camera

NAT (Network Address Translator)  地址映射，IPv4的地址不够，处于网络安全
    完全锥型NAT
    地址限制锥型NAT 限制指定IP
    端口限制锥型NAT 在限制IP的基础上，再加上端口
    对称型NAT 

    NAT穿越原理
    C1，C2向STUN发消息， 交换公网IP及端口 C1->C2, C2->C1甚至是端口猜测

    NAT类型检测

STUN (Simple Traversal of UDP Through NAT) 
    RFC3489/STUN Simple Traversal of UDP Through NAT
    RFC5389/STUN Session Traversal Utilities for NAT

TURN (Traversal Using Relays around NAT)
ICE (Interactive Connectivity Establishment)

SDP(Session Description Protocol) 一种信息的描述标准，主要是用于媒体协商。
    -会话元
    -网络描述
    -流描述
    -安全描述
    -服务质量

