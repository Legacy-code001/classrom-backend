import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express"
import { departments, subjects } from "../db/schema";
import { db } from "../db";
// const app = express()

const router = express.Router()

//get all search with optional search, filterng and pagination
router.get('/', async (req, res) => {
    try {
         const {search, department, page=1, limit=10} = req.query;
         const currentPage = Math.max(1, +page);
         const limitPerpage = Math.max(1, +limit);
         const filterCondition = [];
         const offset = (currentPage - 1) * limitPerpage;

         //if search query exit filter by subjects name or subjects code
         if(search){
            filterCondition.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)

                )
            )
         }

         //if department filter exit match department name
         if(department){
            const deptPathern = `%${String(department).replace(/[%_]/g, '\\$&')}%`;
            filterCondition.push(ilike(departments.name, deptPathern),
                
            )
         }

         //conbine all users if any exist using AND operator
         const whereCluse = filterCondition.length ? and(...filterCondition) : undefined;

         const countResult = await db.select({count: sql<number>`count(*)`})
         .from(subjects)
         .leftJoin(departments, eq(subjects.departmentId, departments.id))
         .where(whereCluse)
          const totalCount = countResult[0]?.count ?? 0 

          const subjectList = await db.select({
            ...getTableColumns(subjects), department: {...getTableColumns(departments)}
          }).from(subjects)
          .leftJoin(departments, eq(subjects.departmentId, departments.id))
          .where(whereCluse).orderBy(desc(subjects.createdAt))
          .limit(limitPerpage)
          .offset(offset)
        res.status(200).json(
            {
                data: subjectList,
                pagination: {
                    page: currentPage,
                    limit: limitPerpage,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount/limitPerpage)
                }
            }
        )

    } catch (error) {
        console.error(`Get /subjects errror: ${error}`)
        res.status(500).json({
            error: 'Failed to get all subjects'
        })
    }
})

export default router;