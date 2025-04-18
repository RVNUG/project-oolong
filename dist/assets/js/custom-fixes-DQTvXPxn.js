import{r as e}from"./vendor-BMipNHhy.js";import{g as t}from"./config-ioy8dq5D.js";import{s as n,j as a}from"./index-S4W26C3k.js";const o="roanoke-valley-net-user-group",r=async()=>{try{const t=await c();if(t&&t.length>0)return t;try{return await i()}catch(e){return await s()}}catch(e){return[]}},i=()=>new Promise(((e,t)=>{const n=`handleMeetupEvents_${Date.now()}`,a=setTimeout((()=>{r.parentNode&&r.parentNode.removeChild(r),delete window[n],t(new Error("Timed out waiting for Meetup API response"))}),1e4);window[n]=t=>{clearTimeout(a);const o=document.getElementById("meetup-jsonp");o&&o.parentNode&&o.parentNode.removeChild(o),delete window[n],e(t.results||[])};const r=document.createElement("script");r.id="meetup-jsonp",r.src=`https://api.meetup.com/${o}/events?status=upcoming,past&desc=true&page=20&callback=${n}`,r.onerror=()=>{clearTimeout(a),r.parentNode&&r.parentNode.removeChild(r),delete window[n],t(new Error("Failed to load Meetup events"))},document.head.appendChild(r)})),s=async()=>{const e=`https://api.meetup.com/${o}/events?status=upcoming,past&desc=true&page=20`;try{const t=await fetch(`https://corsproxy.io/?${encodeURIComponent(e)}`);if(!t.ok)throw new Error(`Failed to fetch from proxy: ${t.status}`);return await t.json()||[]}catch(t){throw t}},c=async()=>{try{const e=t("data/events.json"),n=await fetch(e);if(!n.ok)throw new Error(`Failed to load local events: ${n.status}`);return(await n.json()).events||[]}catch(e){return[]}},l=()=>{const[n,a]=e.useState([]),[o,i]=e.useState([]),[s,c]=e.useState([]),[l,d]=e.useState(!0),[u,m]=e.useState(null),p=e.useCallback((e=>{const t=new Date,n=e.filter((e=>{if(void 0!==e.is_upcoming)return!0===e.is_upcoming;try{const n=new Date(`${e.local_date}T${e.local_time}`);if(!isNaN(n.getTime()))return n>=t}catch(n){}return!1})).sort(((e,t)=>{try{const n=new Date(`${e.local_date}T${e.local_time}`),a=new Date(`${t.local_date}T${t.local_time}`);return isNaN(n.getTime())||isNaN(a.getTime())?0:n.getTime()-a.getTime()}catch(n){return 0}})),a=e.filter((e=>{if(void 0!==e.is_upcoming)return!1===e.is_upcoming;try{const n=new Date(`${e.local_date}T${e.local_time}`);if(!isNaN(n.getTime()))return n<t}catch(n){}return!0})).sort(((e,t)=>{try{const n=new Date(`${e.local_date}T${e.local_time}`),a=new Date(`${t.local_date}T${t.local_time}`);return isNaN(n.getTime())||isNaN(a.getTime())?0:a.getTime()-n.getTime()}catch(n){return 0}}));i(n),c(a)}),[]),g=e.useCallback((async()=>{d(!0),m(null);try{const e=await(async()=>{try{const e=t("data/events.json"),n=await fetch(e);if(n.ok){const e=await n.json();return e.events&&Array.isArray(e.events)?e.events:Array.isArray(e)?e:await r()}return await r()}catch(u){return await r()}})();a(e),p(e)}catch(e){const t=e instanceof Error?e.message:"Failed to load events. Please try again later.";m(t)}finally{d(!1)}}),[p]),h=e.useCallback((async()=>g()),[g]);return e.useEffect((()=>{g()}),[g]),{events:n,upcomingEvents:o,pastEvents:s,loading:l,error:u,refreshEvents:h}},d=e=>{try{const t=e.split("-");if(3===t.length){const e=parseInt(t[0],10),n=parseInt(t[1],10)-1,a=parseInt(t[2],10);if(!isNaN(e)&&!isNaN(n)&&!isNaN(a)){const t=new Date(e,n,a);return isNaN(t.getTime())?"Date not available":t.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}}const n=new Date(e);return isNaN(n.getTime())?"Date not available":n.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}catch(t){return"Date not available"}},u=e=>{try{if(!e)return"Time not available";if(e instanceof Date)return e.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});if("string"==typeof e&&e.match(/^\d{1,2}:\d{2}$/)){const[t,n]=e.split(":"),a=parseInt(t,10),o=parseInt(n,10);if(!isNaN(a)&&!isNaN(o)){const e=new Date;return e.setHours(a),e.setMinutes(o),e.setSeconds(0),e.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}}if("string"==typeof e){if(e.includes(":")){const t=e.split(":");if(t.length>=2){const e=parseInt(t[0],10),n=parseInt(t[1],10);if(!isNaN(e)&&!isNaN(n)){const t=new Date;return t.setHours(e),t.setMinutes(n),t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}}}const t=new Date(e);if(!isNaN(t.getTime()))return t.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0})}return e.toString()}catch(t){return"Time not available"}},m=({event:t,buttonLabel:o="Add to Calendar",className:r=""})=>{const[i,s]=e.useState(!1),c=e.useRef(null),l=e.useRef(null);if(e.useEffect((()=>{const e=e=>{!i||l.current&&l.current.contains(e.target)||c.current&&c.current.contains(e.target)||s(!1)};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}}),[i]),!t.local_date||!t.local_time)return null;const d=new Date(`${t.local_date}T${t.local_time}`);let u;if(t.duration)u=new Date(d.getTime()+t.duration);else{const e=t.name.toLowerCase(),n=d.getHours();u=e.includes("code and coffee")||n>=8&&n<=11?new Date(d.getTime()+108e5):e.includes("social")||e.includes("mixer")||e.includes("networking")?new Date(d.getTime()+72e5):n>=17&&n<=19?new Date(d.getTime()+54e5):new Date(d.getTime()+72e5)}const m=n(t.description)?n(t.description):"Join us for this Roanoke Valley .NET User Group event.",p=d.toISOString().replace(/-|:|\.\d+/g,""),g=u.toISOString().replace(/-|:|\.\d+/g,"");let h="Online Event";t.venue&&!t.is_online&&(h=`${t.venue.name}${t.venue.address_1?", "+t.venue.address_1:""}${t.venue.city?", "+t.venue.city:""}${t.venue.state?", "+t.venue.state:""}`);const N=e=>{e.stopPropagation();const n=`${t.name.replace(/\s+/g,"_")}.ics`,a=(()=>{const e=e=>e.toISOString().replace(/-|:|\.\d+/g,""),n=new Date,a=e(d),o=e(u),r=e(n);return`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//RVNUG//Event Calendar//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nBEGIN:VEVENT\nUID:event-${t.id}@rvnug.org\nSUMMARY:${t.name}\nDTSTAMP:${r}\nDTSTART:${a}\nDTEND:${o}\nDESCRIPTION:${m.replace(/\n/g,"\\n")}\nLOCATION:${h}\nSTATUS:CONFIRMED\nSEQUENCE:0\nTZID:America/New_York\nEND:VEVENT\nEND:VCALENDAR`})(),o=new Blob([a],{type:"text/calendar;charset=utf-8"}),r=document.createElement("a");r.href=URL.createObjectURL(o),r.download=n,document.body.appendChild(r),r.click(),document.body.removeChild(r),s(!1)};return a.jsxs("div",{className:"custom-calendar-dropdown",children:[a.jsxs("button",{ref:c,className:r,onClick:e=>{e.stopPropagation(),s(!i)},"aria-haspopup":"true","aria-expanded":"false","aria-label":"Add to Calendar",children:[a.jsx("i",{className:"far fa-calendar-plus","aria-hidden":"true"})," ",o]}),i&&a.jsxs("div",{ref:l,className:"calendar-dropdown-menu",onClick:e=>e.stopPropagation(),role:"menu","aria-orientation":"vertical",children:[a.jsxs("button",{className:"calendar-option google",onClick:e=>{e.stopPropagation(),window.open((()=>{const e=encodeURIComponent(m),n=encodeURIComponent(h);return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.name)}&dates=${p}/${g}&details=${e}&location=${n}&ctz=America/New_York&sprop=website:rvnug.org`})(),"_blank"),s(!1)},role:"menuitem",children:[a.jsx("i",{className:"fab fa-google","aria-hidden":"true"})," Google Calendar"]}),a.jsxs("button",{className:"calendar-option apple",onClick:e=>{e.stopPropagation(),N(e)},role:"menuitem",children:[a.jsx("i",{className:"fab fa-apple","aria-hidden":"true"})," Apple Calendar"]}),a.jsxs("button",{className:"calendar-option outlook",onClick:e=>{e.stopPropagation(),window.open(`https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(t.name)}&body=${encodeURIComponent(m)}&location=${encodeURIComponent(h)}&startdt=${d.toISOString()}&enddt=${u.toISOString()}`,"_blank"),s(!1)},role:"menuitem",children:[a.jsx("i",{className:"far fa-envelope","aria-hidden":"true"})," Outlook"]}),a.jsxs("button",{className:"calendar-option yahoo",onClick:e=>{e.stopPropagation(),window.open((()=>{const e=encodeURIComponent(t.name),n=encodeURIComponent(m),a=encodeURIComponent(h);return`https://calendar.yahoo.com/?v=60&title=${e}&st=${p}&et=${g}&desc=${n}&in_loc=${a}`})(),"_blank"),s(!1)},role:"menuitem",children:[a.jsx("i",{className:"fab fa-yahoo","aria-hidden":"true"})," Yahoo"]}),a.jsxs("button",{className:"calendar-option ics",onClick:N,role:"menuitem",children:[a.jsx("i",{className:"far fa-calendar-alt","aria-hidden":"true"})," Download .ics"]})]})]})},p=(e,t=!1)=>{if(!e||t)return"";if(!e.address_1)return`${e.city||""}, ${e.state||""} ${e.zip||""}`.trim().replace(/^,\s+/,"");const n=`${e.city||""}, ${e.state||""}`.trim(),a=`${e.city||""},  ${e.state||""}`.trim();if(e.address_1===n||e.address_1===a)return`${e.city||""}, ${e.state||""} ${e.zip||""}`.trim();{const t=[];e.address_1&&t.push(e.address_1),e.city&&t.push(e.city),e.state&&t.push(e.state);let n=t.join(", ");return e.zip&&(n+=` ${e.zip}`),n.trim()}},g=e=>Boolean(e.is_online||e.venue&&"Online Event"===e.venue.name);export{m as E,p as a,d as b,u as f,g as i,l as u};
//# sourceMappingURL=custom-fixes-DQTvXPxn.js.map
