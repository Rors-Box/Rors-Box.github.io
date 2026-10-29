'use strict';
function researchHeading(title,copy=''){return `<div class="section-heading"><div><h2>${esc(title)}</h2>${copy?`<p>${esc(copy)}</p>`:''}</div></div>`}
function researchTable(headers,rows){return `<div class="scroll-table"><table class="research-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function marketResearch(r){
 const x=r.extended;if(!x)return '<p class="archive-note">此日保留原归档。市场轮动与新开仓扩展从10月28日增补版起记录，没有用今天的观点补写旧计划。</p>';
 const sectorTable=rows=>researchTable(['方向','昨日','今日','上涨宽度','成交额 / 亿元','金额名次','领涨代表','变化'],rows.map(s=>[esc(s.name),pc(s.previousPct),`<strong class="${cls(s.pct)}">${pc(s.pct)}</strong>`,`${s.breadth.toFixed(1)}%`,s.amountYi.toFixed(1),s.amountRank,`${esc(s.leader)} ${pc(s.leaderPct)}`,esc(s.state)]));
 const hotRows=x.hot.names.map(s=>[`${esc(s.name)}<span class="code">${s.code}</span>`,esc(s.ranks.join(' / ')),esc(s.tags),s.close.toFixed(2),`<span class="${cls(s.pct)}">${pc(s.pct)}</span>`,`<span class="${cls(s.openReturn)}">${pc(s.openReturn)}</span>`,pc(s.highDrawdown),`${s.closeLocation.toFixed(0)}%`]);
 return `<section id="market-research" data-research-version="${esc(x.version)}">`+
 researchHeading('市场结构与风格','先看市场给谁回报，再评价自己的持仓')+
 `<section class="panel research-summary"><h3>${esc(x.structure.headline)}</h3><ul>${x.structure.facts.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p class="small-copy">${esc(x.structure.style)}</p></section>`+
 researchHeading('板块高低切换','同花顺行业：重点涨跌、成交额与持仓相关方向；与昨日同口径比较')+
 `<section class="panel">${sectorTable(x.sectors)}<p class="small-copy">宽度=上涨/(上涨+下跌)，不含平盘；“昨日缺失”不推算轮动。连续出现只代表仍在候选表，不能自动解释为持续上涨。</p><details class="research-details"><summary>概念方向另表：避免把行业与概念混为一个排名</summary>${sectorTable(x.concepts)}<p class="small-copy">概念快照覆盖100个板块，排名限当前覆盖；昨日缺失，不能假设它们今日首次启动。概念有重叠，成交额不加总。</p></details></section>`+
 researchHeading('今天最强的方向',x.best.name)+
 `<section class="panel"><p>${esc(x.best.reason)}</p><div class="core-roles">${x.best.roles.map(v=>`<div><b>${esc(v.role)}</b><p>${esc(v.text)}</p></div>`).join('')}</div><p class="small-copy">${esc(x.best.contrast)}</p></section>`+
 researchHeading('日内关键节点','分钟样本的相对反馈；不以收盘榜猜测资金轮动路径')+
 `<section class="panel">${researchTable(['时点','传媒跟踪4股 / 均涨幅','物理AI跟踪6股 / 均涨幅'],x.intraday.map(s=>[esc(s.time),...s.groups.map(g=>`<span class="${cls(g.pct)}">${pc(g.pct)}</span>（${g.n}只）`)]))}<p class="small-copy">传媒4股：芒果、果麦、掌阅、当虹；物理AI6股：凡拓、奥比、华依、奥普特、海天瑞声、丝路。${esc(x.intradayNote)}</p></section>`+
 researchHeading('热门股反馈',`${x.hot.n}只去重热门：保留来源、走势质量和回吐情况`)+
 `<section class="panel"><div class="market-grid"><div><span>当前池上涨比例</span><strong>${x.hot.advancePct.toFixed(1)}%</strong></div><div><span>日涨幅中位数</span><strong>${pc(x.hot.median)}</strong></div><div><span>开到收中位数</span><strong>${pc(x.hot.openMedian)}</strong></div><div><span>池内均涨幅</span><strong>${pc(x.hot.mean)}</strong></div></div><p class="small-copy">${esc(x.hot.note)}</p><p class="small-copy">抓取时间：${Object.entries(x.hot.capture).map(([s,t])=>`${esc(s)} ${esc(t||'待核')}`).join('；')}。高点到收盘回落为当日最高价至收盘的变化，不代表持有期最大回撤。</p>${researchTable(['股票','热榜名次','行业/概念标签','收盘','日涨幅','开到收','高点到收','区间收盘位置'],hotRows.slice(0,10))}<details class="research-details"><summary>展开其余${Math.max(hotRows.length-10,0)}只热门股</summary>${researchTable(['股票','热榜名次','行业/概念标签','收盘','日涨幅','开到收','高点到收','区间收盘位置'],hotRows.slice(10))}</details></section>`+
 `<details class="research-details evidence-boundary"><summary>本次补充的数据边界与版本</summary><ul>${x.gaps.map(g=>`<li>${esc(g)}</li>`).join('')}</ul><p>${esc(x.revision)}</p><small>增补时间 ${esc(x.publishedAt)} · ${esc(x.version)}</small></details></section>`;
}
function newTradePlans(r){
 const x=r.extended;if(!x)return '';
 const n=x.newEntries;
 return researchHeading('明日三种情景','写清触发与取消条件；没有校准样本，不填主观胜率')+
 `<div class="scenario-grid">${x.scenarios.map(s=>`<article class="panel scenario"><h3>${esc(s.name)}</h3><dl><dt>如何识别</dt><dd>${esc(s.trigger)}</dd><dt>怎么执行</dt><dd>${esc(s.action)}</dd><dt>何时取消</dt><dd>${esc(s.cancel)}</dd></dl></article>`).join('')}</div>`+
 researchHeading('新开仓候选','与已有持仓分别计划；研究排序不代表已触发买入')+
 `<section class="panel research-summary"><h3>${esc(n.priority)}</h3><p>${esc(n.funding)}</p><p class="small-copy">${esc(n.timing)}</p></section>`+
 researchTable(['股票','计划地位','使用的策略','触发重点'],n.items.map(p=>[`${esc(p.name)}<span class="code">${p.code}</span>`,esc(p.status),esc(p.setup),esc(p.trigger)]))+
 `<div class="new-entry-list">${n.items.map(p=>`<article class="plan-card new-entry"><div class="plan-card-head"><h3>${esc(p.name)} <small>${p.code}</small></h3><p>${esc(p.status)}</p></div><div class="plan-body"><div class="plan-line"><b>量价与位置</b>${esc(p.facts)}</div><div class="plan-line"><b>开仓触发</b>${esc(p.trigger)}</div><div class="plan-line failure"><b>失效与风险</b>${esc(p.failure)}</div><div class="plan-line"><b>不追价与空间</b>${esc(p.avoid)}</div><div class="plan-line"><b>资格待核</b>${esc(p.qualification)}</div></div></article>`).join('')}</div>`+
 researchHeading('蒸馏规则如何用到今天','规则必须落到具体证据、通过条件和反证')+
 `<section class="panel">${x.applications.map(a=>`<article class="rule-application"><h3>${esc(a.rule)}</h3><p>${esc(a.applied)}</p><small>${esc(a.source)}</small></article>`).join('')}</section>`+
 `<section class="panel evidence-boundary"><h3>明日收盘怎样验收</h3><p class="small-copy">本次v3新增观察已经单独冻结，原持仓计划保留。次日分别记录未触发、触发、买不到、数据不足；核对触发后走势和T+1限制，只有可核验成交才计算扣费收益。没有触发的股票上涨，不计作成功买单。</p></section>`+researchHeading('已有持仓的执行计划','先管理当前风险，再决定是否需要新开仓');
}
