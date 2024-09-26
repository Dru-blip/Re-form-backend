import { SetMetadata } from "@nestjs/common";


// Decorator for marking controller handlers as public
export const Public=()=>SetMetadata("IsPublic",true)