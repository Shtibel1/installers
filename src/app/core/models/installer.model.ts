import { AppUser } from "./app-user.model";
import { Category } from "./category.model";
import { WorkerBase } from "./worker.model";

interface Installer extends WorkerBase{
    categories: Category[]
}

interface InstallerDto extends WorkerBase {
    categories: number[];
}

export {
    Installer,
    InstallerDto
}
