import { WorkerBase } from '../models/worker.model';
import { Option } from './../../core/models/option.model';

export function workerToOption(worker: WorkerBase): Option<WorkerBase> {
  return {
    label: worker.name,
    value: worker,
  };
}
