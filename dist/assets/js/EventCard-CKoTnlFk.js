import{i as e,f as a,a as s,E as n}from"./custom-fixes-DQTvXPxn.js";import{j as t}from"./index-S4W26C3k.js";import{L as l}from"./vendor-BMipNHhy.js";const i=({event:i})=>{let c=null;try{i.local_date&&i.local_time&&(c=new Date(`${i.local_date}T${i.local_time}`),isNaN(c.getTime())&&(c=null))}catch(N){}const r=(e,a)=>e&&e instanceof Date&&!isNaN(e.getTime())?e.toLocaleString("default",a):"TBD",d=e(i),m=!!c&&new Date>c,o=i.local_time?a(i.local_time):"Time TBD",v=s(i.venue,d);return t.jsxs("div",{className:`event-card ${d?"online-event":""} ${m?"past-event":""}`,children:[t.jsxs("div",{className:"event-date",children:[t.jsx("div",{className:"event-month",children:r(c,{month:"short"})}),t.jsx("div",{className:"event-day",children:(x=c,x&&x instanceof Date&&!isNaN(x.getTime())?x.getDate().toString():"--")}),t.jsx("div",{className:"event-year",children:r(c,{year:"numeric"})})]}),t.jsxs("div",{className:"event-details",children:[d&&t.jsx("div",{className:"event-badge online-badge",children:"Online"}),m&&t.jsx("div",{className:"event-badge past-badge",children:"Past"}),t.jsx("h3",{className:"event-title",children:t.jsx(l,{to:`/event/${i.id}`,children:i.name})}),t.jsxs("div",{className:"event-meta",children:[t.jsxs("span",{className:"event-time",children:[t.jsx("i",{className:"far fa-clock"})," ",o]}),i.venue&&i.venue.name&&!d&&t.jsxs("span",{className:"event-location",children:[t.jsx("i",{className:"fas fa-map-marker-alt"})," ",i.venue.name,v&&t.jsxs("span",{className:"venue-city",children:[", ",v]})]}),d&&t.jsxs("span",{className:"event-location online",children:[t.jsx("i",{className:"fas fa-laptop"})," Online Event"]})]}),t.jsx("p",{className:"event-description",children:i.description?(e=>{const a=document.createElement("div");a.innerHTML=e;const s=a.textContent||a.innerText||"";return s.length>150?s.substring(0,150)+"...":s})(i.description):"No description available"}),t.jsxs("div",{className:"event-actions",children:[m?t.jsx("span",{className:"event-completed",children:"Event completed"}):t.jsxs(t.Fragment,{children:[t.jsxs("a",{href:i.link,className:"btn btn-primary",target:"_blank",rel:"noopener noreferrer",children:[t.jsx("i",{className:"fas fa-calendar-plus"})," RSVP on Meetup"]}),t.jsx(n,{event:i,buttonLabel:"Add to Calendar",className:"btn btn-calendar"})]}),t.jsxs(l,{to:`/event/${i.id}`,className:"btn btn-secondary",children:[t.jsx("i",{className:"fas fa-info-circle"})," View Details"]})]})]})]});var x};export{i as E};
//# sourceMappingURL=EventCard-CKoTnlFk.js.map
