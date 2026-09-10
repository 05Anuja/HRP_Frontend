// import Axios from "@/utils/axiosConfig";
// import LogosilF from "@/assets/LogosilF.jpeg";
// import {
//   Search,
//   Plus,
//   MoreVertical,
//   Upload,
//   Pencil,
//   Trash2,
// } from "lucide-react";

// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import DeleteListConfirm from "./DeleteListConfirm";


// // Real API rows use `_id`, mock rows use `id` — normalize so every row
// // has one stable, unique identifier no matter which source it came from.
// const getId = (list) => list?._id;


// const ActionsMenu = ({ list, onImport, onEdit, onDelete, openId, setOpenId }) => {
//   const id = getId(list);
//   const open = openId === id;
//   const ref = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpenId((prevId) => (prevId === id ? null : prevId));
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [id, setOpenId]);

//   return (
//     <div className="relative flex justify-center" ref={ref}>
//       <button
//         onClick={() => setOpenId(open ? null : id)}
//         className="rounded p-1 text-gray-500 hover:bg-gray-100"
//       >
//         <MoreVertical size={18} />
//       </button>

//       {open && (
//         <div className="absolute right-0 top-8 z-10 w-40 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg">
//           <button
//             onClick={() => { onImport(list); setOpenId(null); }}
//             className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-gray-50"
//           >
//             <Plus size={15} /> Import
//           </button>
//           <button
//             onClick={() => { onEdit(list); setOpenId(null); }}
//             className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-gray-50"
//           >
//             <Pencil size={15} /> Edit
//           </button>
//           <button
//             onClick={() => { onDelete(list); setOpenId(null); }}
//             className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-gray-50"
//           >
//             <Trash2 size={15} /> Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const UploadsList = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // All the list stored here
//   const [lists, setLists] = useState([]);

//   // Search state
//   const [search, setSearch] = useState("");

//   // Open id state — now tracks the normalized id (see getId above)
//   const [openId, setOpenId] = useState(null);

//   // Navigation handlers
//   const handleCreateList = () => {
//     navigate("/uploads/create");
//   };

//   const handleImport = (list) => {
//     navigate("/uploads/import", { state: { list } });
//   };

//   const handleEdit = (list) => {
//     navigate(`/uploads/edit/${getId(list)}`, { state: { list } });
//   };

//   // Handle Delete List Modal
//   const [deleteList, setDeleteList] = useState(null);
//   const handleDelete = (list) => setDeleteList(list);
//   const handleListDeleted = (deleted) => {
//     setLists((prev) => prev.filter((l) => getId(l) !== getId(deleted)));
//   };

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         const { data } = await Axios.get("/lists");
//         setLists(data?.data);
//       } catch (err) {
//         console.log("Failed to load leads");
//       }
//     };
//     fetchLists();
//   }, []);

//   const filteredLists = lists.filter((l) =>
//     l.name.toLowerCase().includes(search.toLowerCase())
//   );

//   useEffect(() => {
//     if (deleteList) {
//       const mainEl = document.querySelector("main");
//       const prevBodyOverflow = document.body.style.overflow;
//       const prevMainOverflow = mainEl ? mainEl.style.overflow : "";

//       document.body.style.overflow = "hidden";
//       if (mainEl) mainEl.style.overflow = "hidden";

//       return () => {
//         document.body.style.overflow = prevBodyOverflow;
//         if (mainEl) mainEl.style.overflow = prevMainOverflow;
//       };
//     }
//   }, [deleteList]);

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-5">
//       {/* Search + Create List */}
//       <div className="mb-5 flex items-center justify-between gap-4">
//         <div className="relative w-72">
//           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search lists..."
//             className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
//           />
//         </div>
//         <button
//           onClick={handleCreateList}
//           className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//         >
//           <Plus size={16} /> Create List
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-lg border border-gray-100">
//         <table className="min-w-full text-sm">
//           <thead>
//             <tr className="bg-gray-50 text-left text-xs font-bold text-gray-700">
//               <th className="px-5 py-3">Name</th>
//               <th className="px-5 py-3">ID</th>
//               <th className="px-5 py-3">Campaign</th>
//               <th className="px-5 py-3">Description</th>
//               <th className="px-5 py-3">Created At</th>
//               <th className="px-5 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {filteredLists.map((list) => (
//               <tr key={getId(list)} className="hover:bg-gray-50">
//                 <td className="px-5 py-3 font-semibold text-gray-900">{list.name}</td>
//                 <td className="px-5 py-3 text-gray-600">{getId(list)}</td>
//                 <td className="px-5 py-3 text-gray-600">{list.campaign}</td>
//                 <td className="px-5 py-3 text-gray-600">{list.description}</td>
//                 <td className="px-5 py-3 text-gray-600">{list.createdAt}</td>
//                 <td className="px-5 py-3">
//                   <ActionsMenu
//                     list={list}
//                     onImport={handleImport}
//                     onEdit={handleEdit}
//                     onDelete={handleDelete}
//                     openId={openId}
//                     setOpenId={setOpenId}
//                   />
//                 </td>
//               </tr>
//             ))}
//             {filteredLists.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
//                   No lists match "{search}".
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <DeleteListConfirm
//         isOpen={!!deleteList}
//         list={deleteList}
//         onClose={() => setDeleteList(null)}
//         onDeleted={handleListDeleted}
//       />
//     </div>
//   );
// };

// export default UploadsList;

import Axios from "@/utils/axiosConfig";
import LogosilF from "@/assets/LogosilF.jpeg";

import {
  Search,
  Plus,
  MoreVertical,
  Upload,
  Pencil,
  Trash2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";

import DeleteListConfirm from "./DeleteListConfirm";

// --------------------------------------------------
// Get unique ID
// --------------------------------------------------

const getId = (list) => list?._id;

// --------------------------------------------------
// Actions Menu
// --------------------------------------------------

const ActionsMenu = ({
  list,
  onImport,
  onEdit,
  onDelete,
  openId,
  setOpenId,
}) => {
  const id = getId(list);
  const open = openId === id;

  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const positionMenu = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const spacing = 4;
    const padding = 8;
    const canOpenBelow =
      triggerRect.bottom + spacing + menuRect.height <=
      window.innerHeight - padding;
    const top = canOpenBelow
      ? triggerRect.bottom + spacing
      : triggerRect.top - menuRect.height - spacing;
    const left = Math.min(
      Math.max(padding, triggerRect.right - menuRect.width),
      window.innerWidth - menuRect.width - padding
    );

    setMenuPosition({
      top: Math.max(padding, top),
      left,
    });
  };

  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(positionMenu);
    const handleViewportChange = () => positionMenu();

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpenId((prevId) =>
          prevId === id ? null : prevId
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [id, setOpenId]);

  return (
    <div className="flex justify-center">
      <button
        ref={triggerRef}
        onClick={() =>
          setOpenId(open ? null : id)
        }
        className="rounded p-1 text-gray-500 hover:bg-gray-100"
      >
        <MoreVertical size={18} />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left }}
          className="fixed z-[1000] w-40 rounded-lg border border-gray-100 bg-white py-1.5 shadow-lg"
        >

          {/* Import */}
          <button
            onClick={() => {
              onImport(list);
              setOpenId(null);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-gray-50"
          >
            <Plus size={15} />
            Import
          </button>

          {/* Edit */}
          <button
            onClick={() => {
              onEdit(list);
              setOpenId(null);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-blue-500 hover:bg-gray-50"
          >
            <Pencil size={15} />
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete(list);
              setOpenId(null);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-gray-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

// --------------------------------------------------
// Uploads List
// --------------------------------------------------

const UploadsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // Lists
  // --------------------------------------------------

  const [lists, setLists] = useState([]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalLists, setTotalLists] = useState(0);

  // Number of records per page
  const limit = 10;

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Open Actions Menu
  // --------------------------------------------------

  const [openId, setOpenId] = useState(null);

  // --------------------------------------------------
  // Create List
  // --------------------------------------------------

  const handleCreateList = () => {
    navigate("/uploads/create");
  };

  // --------------------------------------------------
  // Import
  // --------------------------------------------------

  const handleImport = (list) => {
    navigate("/uploads/import", {
      state: {
        list,
      },
    });
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (list) => {
    navigate(
      `/uploads/edit/${getId(list)}`,
      {
        state: {
          list,
        },
      }
    );
  };

  // --------------------------------------------------
  // Delete List
  // --------------------------------------------------

  const [deleteList, setDeleteList] =
    useState(null);

  const handleDelete = (list) => {
    setDeleteList(list);
  };

  // --------------------------------------------------
  // After Delete
  // --------------------------------------------------

  const handleListDeleted = (deleted) => {
    setLists((prev) =>
      prev.filter(
        (l) =>
          getId(l) !== getId(deleted)
      )
    );

    // If deleting the last item on a page,
    // move back to previous page.
    if (
      lists.length === 1 &&
      currentPage > 1
    ) {
      setCurrentPage((prev) =>
        prev - 1
      );
    }
  };

  // --------------------------------------------------
  // Fetch Lists
  // --------------------------------------------------

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);

        const { data } = await Axios.get(
          "/lists",
          {
            params: {
              page: currentPage,
              limit: limit,
              search: search.trim(),
            },
          }
        );

        setLists(data?.data || []);

        setTotalPages(
          data?.totalPages || 1
        );

        setTotalLists(
          data?.totalLists || 0
        );
      } catch (err) {
        console.error(
          "Failed to load lists:",
          err
        );

        setLists([]);

        setTotalPages(1);

        setTotalLists(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [currentPage, search]);

  // --------------------------------------------------
  // Search Handler
  // --------------------------------------------------

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    // Whenever search changes,
    // start from page 1.
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Previous Page
  // --------------------------------------------------

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (prev) => prev - 1
      );
    }
  };

  // --------------------------------------------------
  // Next Page
  // --------------------------------------------------

  const handleNextPage = () => {
    if (
      currentPage < totalPages
    ) {
      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  // --------------------------------------------------
  // Go To Page
  // --------------------------------------------------

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);
    }
  };

  // --------------------------------------------------
  // Prevent background scrolling when delete modal
  // is open
  // --------------------------------------------------

  useEffect(() => {
    if (deleteList) {
      const mainEl =
        document.querySelector("main");

      const prevBodyOverflow =
        document.body.style.overflow;

      const prevMainOverflow =
        mainEl
          ? mainEl.style.overflow
          : "";

      document.body.style.overflow =
        "hidden";

      if (mainEl) {
        mainEl.style.overflow =
          "hidden";
      }

      return () => {
        document.body.style.overflow =
          prevBodyOverflow;

        if (mainEl) {
          mainEl.style.overflow =
            prevMainOverflow;
        }
      };
    }
  }, [deleteList]);

  // --------------------------------------------------
  // Calculate visible record range
  // --------------------------------------------------

  const startRecord =
    totalLists === 0
      ? 0
      : (currentPage - 1) * limit + 1;

  const endRecord =
    Math.min(
      currentPage * limit,
      totalLists
    );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">

      {/* ==================================================
          Search + Create List
      ================================================== */}

      <div className="mb-5 flex items-center justify-between gap-4">

        {/* Search */}
        <div className="relative w-72">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search lists..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none"
          />

        </div>

        {/* Create List */}
        <button
          onClick={handleCreateList}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus size={16} />
          Create List
        </button>

      </div>

      {/* ==================================================
          Table
      ================================================== */}

      <div className="overflow-x-auto rounded-lg border border-gray-100">

        <table className="min-w-full text-sm">

          {/* Table Header */}
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-bold text-gray-700">

              <th className="px-5 py-3">
                Name
              </th>

              <th className="px-5 py-3">
                ID
              </th>

              <th className="px-5 py-3">
                Campaign
              </th>

              <th className="px-5 py-3">
                Description
              </th>

              <th className="px-5 py-3">
                Created At
              </th>

              <th className="px-5 py-3 text-center">
                Actions
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100">

            {/* Loading */}
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-gray-400"
                >
                  Loading lists...
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading &&
              lists.map((list) => (
                <tr
                  key={getId(list)}
                  className="hover:bg-gray-50"
                >

                  {/* Name */}
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    {list.name}
                  </td>

                  {/* ID */}
                  <td className="px-5 py-3 text-gray-600">
                    {getId(list)}
                  </td>

                  {/* Campaign */}
                  <td className="px-5 py-3 text-gray-600">
                    {list.campaign}
                  </td>

                  {/* Description */}
                  <td className="px-5 py-3 text-gray-600">
                    {list.description}
                  </td>

                  {/* Created At */}
                  <td className="px-5 py-3 text-gray-600">
                    {list.createdAt}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">

                    <ActionsMenu
                      list={list}
                      onImport={handleImport}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      openId={openId}
                      setOpenId={setOpenId}
                    />

                  </td>

                </tr>
              ))}

            {/* No Data */}
            {!loading &&
              lists.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    {search
                      ? `No lists match "${search}".`
                      : "No lists found."}
                  </td>
                </tr>
              )}

          </tbody>

        </table>

      </div>

      {/* ==================================================
          Pagination
      ================================================== */}

      {totalLists > 0 && (
        <div className="mt-4 flex items-center justify-between">

          {/* Showing X - Y of Z */}
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {startRecord}
            </span>
            {" - "}
            <span className="font-medium text-gray-700">
              {endRecord}
            </span>
            {" of "}
            <span className="font-medium text-gray-700">
              {totalLists}
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1">

            {/* Previous */}
            <button
              onClick={
                handlePreviousPage
              }
              disabled={
                currentPage === 1 ||
                loading
              }
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                currentPage === 1 ||
                loading
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() =>
                  handlePageChange(
                    page
                  )
                }
                disabled={loading}
                className={`min-w-[36px] rounded-lg border px-3 py-1.5 text-sm ${
                  currentPage === page
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                } ${
                  loading
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={
                handleNextPage
              }
              disabled={
                currentPage ===
                  totalPages ||
                loading
              }
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                currentPage ===
                  totalPages ||
                loading
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Next
            </button>

          </div>

        </div>
      )}

      {/* ==================================================
          Delete Confirmation
      ================================================== */}

      <DeleteListConfirm
        isOpen={!!deleteList}
        list={deleteList}
        onClose={() =>
          setDeleteList(null)
        }
        onDeleted={handleListDeleted}
      />

    </div>
  );
};

export default UploadsList;