import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';

@Entity('alert') 
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  alertValue: number; 

  @Column()
  email: string; 

  @Column()
  chainType:string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
