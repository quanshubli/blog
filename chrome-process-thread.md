## 前言
本文是笔者关于浏览器进程和线程学习的一个整理记录。


正文开始

## 进程与线程
首先简单描述一下CPU、进程和线程的概念。

* CPU是计算机系统的运算和控制核心，是信息处理、程序运行的最终执行单元。

* 进程是CPU所能处理的单个任务，单个CPU一次只能运行一个进程。

* 一个进程包含一个或多个线程。同一进程中的线程共享该进程中的内存空间。

下面以工厂为喻，有助于理解它们的关系。

* CPU - 工厂

* 进程 - 车间

* 线程 - 工人

一个工厂的资源有限，同一时刻只能供给一个车间工作，其他车间必须停工。车间与车间相互隔离。每个车间里有一个或多个工人在工作，工人们共享该车间里的资源。


## 参考链接
1.[http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)

2.[https://www.cnblogs.com/D-DZDD/p/7203176.html](https://www.cnblogs.com/D-DZDD/p/7203176.html)

3.[https://blog.csdn.net/yl02520/article/details/21192747](https://blog.csdn.net/yl02520/article/details/21192747)

4.[http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html](http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html)