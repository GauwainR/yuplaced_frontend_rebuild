
import React from "react";

const mock = [
  { id: 1, name: "Work", tasks: [{id:1,title:"Task 1"}]},
  { id: 2, name: "Study", tasks: [{id:2,title:"Task 2"}]},
];

export const FolderBoard = () => {
  return (
    <div style={{display:"flex", gap:20}}>
      {mock.map(folder => (
        <div key={folder.id} style={{padding:16, background:"#111", borderRadius:12}}>
          <h3>{folder.name}</h3>
          {folder.tasks.map(t => (
            <div key={t.id} style={{padding:8, marginTop:8, background:"#222", borderRadius:8}}>
              {t.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
