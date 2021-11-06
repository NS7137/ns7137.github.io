---
layout: post
title: lecture9. Scalability and Security
author: ns7137
description: cs50-web notes
---

# Load Balancer

- 根据服务器被访问量分配请求

- Load Balancing Methods
	- Random Choice
	- Round Robin
	- Fewest Connections
	- ...

- Session-Aware Load Balancing
	- Sticky Sessions
	- Sessions in Database
	- Client-Side Sessions
	- ...

# Database partition

- 目的为了在特定SQL操作中减少数据读写的总量以缩减响应时间
- 水平分区，每个分区列字段都是一样的，可以通过年龄，日期，自增主键来分区
- 垂直分区，对表的列进行分区，减少表的宽度，使特定的列在特定的分区，提高查询效率

# Database replication

- 从单库扩展成多库，至少有一种数据更新同步机制

## 复制方式

- 异步复制，在写完之后，再告知其他实例更新数据。客户端无需等待复制操作，不存在额外性能影响。
	- 有数据丢失风险
	- 无法保证强一致性，因为存在复制延迟

- 同步复制，发生写操作时，立即将操作同步到其他实例，复制完成之后才算写完。严格的一致性要求，考虑同步复制。影响性能和可用性。
	- 性能影响，等待整个复制过程完成
	- 可用性影响，只要有一个实例出现故障(网络等原因),整个写操作就会失败

- 半同步复制，两种方式结合使用。即一部分数据实例同步复制，其余异步复制

## 拓扑结构

- 单主结构 Single-Primary replication
	- 写操作只允许发生在主库，由主库将写操作复制到其他从库，从库只支持读操作
	- 不适用于 写密集(write-intensive)的应用
	- 访问主库延迟问题，在某些区域发起写操作可能承担较高延迟
	- 主库down机,重选机制，故障转移策略难点
		- 如何确定主库down
		- 如何选择新leader
		- 如何将写操作转移到新leader上
	- 特殊情况，旧主库恢以为自己还是主库，出现分裂。网络故障也会导致这样情况，两个集群之间出现故障，无法互访访问，都以为另一队down，于是各自开始大选。一旦发生存在多个主库，直接停掉一个STONITH(shoot the other node in the head)

- 多主结构 Multi-Primary replication
	- 写操作能够同时发生在多个库，如何解决写入冲突
		- 避免冲突：按内容特征分库存储，互不相干
		- LWW last-write-win策略：给每个写操作带上时间戳，只保留最新版本
		- 交由用户解决：记下冲突，提示用户，由用户决定保留哪一份

- 无主结构 Leaderless replication
	- 避免使之成为 全主结构
		- 写：客户端同时向多个数据库写，只要有一些成功了就算写完
		- 读：客户端同时从多个数据库读，各个库返回数据及其对应版本号，客户端根据版本号决定采用哪个
	- 没有主库意味着不需要考虑故障转移，单库故障不影响整体
	- 没有主库意味着没有数据同步机制，读到旧值无法自动更正，所以需要额外纠错机制，在读到旧值时将新值写回去(Read repair)，或由独立进程专门负责旧值纠正
	- 读写操作的目标库数量，w个库写成功，接着成功读到r个库数据，那么必须满足w+r>库的总数

## 具体实现 3种方式

- 基于语句的复制：将写操作语句复制给其他库执行
	- 并不是所有语句的执行结果都是确定的，还要确保事务操作在所在数据库上的原子性。
- 日志传送式复制：物理复制，将数据库日志传递给其他从库
	- 无法跨数据库版本使用，数据物理存储方式可能变化。不适用于多主结构，无法把多份日志合并成一份
- 基于行的赋值：逻辑复制，传递专门用于复制的日志，按行复制
	- 是前两种的结合，按行复制需要记录更多的信息

# Caching

- Client-Side Caching 在应用服务内部再加一层缓存，从而进一步提升访问速度
- Cache-Control: max-age=86400 设置cache过期时间
- ETag: "747765E74796569676874"  page版本，根据版本是否需要更新
- Server-Side Caching

# Security

- Secret-Key Cryptography
	- 发送方把plaintext和key编码成Ciphpertext和key一起发送
	- 接收方收到Ciphertext和key解码成plaintext

- Public-Key Cryptography
	- public key 和 private key 两种密钥
	- 发送方使用public-key 编码文件成Ciphertext发送
	- 接收方使用private-key 解码文件成plaintext

## SQL中的安全

- 存储的仅是经过hash过的密码
- 防止sql injection

## API keys

- Rate Limiting
- Route Authentication

## Cross-Site Scripting

- 跨站脚本攻击（Cross-site scripting，XSS）是一种安全漏洞，攻击者可以利用这种漏洞在网站上注入恶意的客户端代码。当被攻击者登陆网站时就会自动运行这些恶意代码，从而，攻击者可以突破网站的访问权限，冒充受害者。

## Cross-Site Request Forgery

-  跨站请求伪造，也被称为“One Click Attack”或者Session Riding，通常缩写为CSRF或者XSRF，是一种对网站的恶意利用。攻击者盗用了你的身份，以你的名义发送恶意请求，对服务器来说这个请求是完全合法的，但是却完成了攻击者所期望的一个操作，比如以你的名义发送邮件、发消息，盗取你的账号，添加系统管理员，甚至于购买商品、虚拟货币转账等。