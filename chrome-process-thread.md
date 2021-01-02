## 前言
本文是笔者关于Chrome浏览器架构的一个学习记录。


正文开始

## CPU和GPU
* CPU(Central Processing Unit)，中央处理器，是计算机系统的运算和控制核心，是信息处理、程序运行的最终执行单元。CPU是计算机的大脑。

* GPU(Graphics Processing Unit)，图形处理器，是专门用来做图像和图形运算工作的处理器。

## 进程与线程
* 进程是CPU所能处理的单个任务，单个CPU一次只能运行一个进程。

* 一个进程包含一个或多个线程。同一进程中的线程共享该进程中的资源。

* 进程可以要求操作系统启动另一个进程来处理不同的任务。

* 进程间可以通过Inter Process Communication(IPC)进行通信。

下面以工厂为喻，有助于理解它们的关系。

* CPU - 工厂

* 进程 - 车间

* 线程 - 工人

一个工厂的资源有限，同一时刻只能供给一个车间工作，此时其他车间必须停工。车间与车间相互隔离。每个车间里有一个或多个工人在工作，工人们共享该车间里的资源。

## Chrome的进程架构
通常浏览器所采用的架构大致可以分为两种：

1. 单进程多线程
2. 多进程多线程配合IPC

Chrome采用的是第二种，多进程的架构。

### Chrome多进程的优点

* 一个进程的崩溃不会影响其他进程的工作。当多个tab由不同的进程管理时，其中一个tab页面无响应时，其他tab页面仍然可以正常访问。

* 安全性(沙箱)。因为操作系统提供了方法来限制进程的权限，所以浏览器可以通过某些特性对某些进程进行沙箱处理。比如对那些处理任意用户输入的进程(如Renderer Process)，Chrome限制了其访问任意文件的权限。

进程有自己的私有内存空间，通常会存储一些公共模块的副本(比如V8引擎)。这就意味着多进程的架构需要占用比较多的内存。所以Chrome会根据硬件的条件来对进程数量进行控制。比如在高性能的硬件环境中，Chrome会为每个服务创建一个进程，以此提高处理效率；而在低性能环境下，Chrome通过合并进程来减少内存开销，比如将同一站点的多个tab合并到一个进程。

### Chrome中的进程

* Browser Process(浏览器进程)是浏览器中的一个全局进程。它负责调节和管理其他进程；处理浏览器的交互，比如地址栏、书签、后退/前进按钮等；处理一些不可见的任务，比如网络请求、文件访问等。

* Renderer Process(渲染进程)。一般一个tab页会对应一个渲染进程，负责处理页面的渲染。

* Plugin Process(插件进程)负责控制插件，比如flash。

* GPU Process会被分成多个进程，去处理多个tab页中的GPU任务。

...

### 站点隔离(Site Isolation)

在同一个tab页中的跨站点iframe，由独立的Renderer Process处理。比如一个tab页面中嵌套了两个iframe，那么这个页面总共会涉及到三个Renderer Process。

## 参考链接
1.[http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)

2.[https://www.cnblogs.com/D-DZDD/p/7203176.html](https://www.cnblogs.com/D-DZDD/p/7203176.html)

3.[https://blog.csdn.net/yl02520/article/details/21192747](https://blog.csdn.net/yl02520/article/details/21192747)

4.[http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html](http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html)

5.[https://developers.google.com/web/updates/2018/09/inside-browser-part1](https://developers.google.com/web/updates/2018/09/inside-browser-part1)