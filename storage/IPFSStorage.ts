import { create } from 'ipfs-http-client';
import { Readable } from 'stream';

export interface CourseContent {
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  skills: string[];
  prerequisites: string[];
  learningObjectives: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  readingMaterial?: string;
  quiz?: Quiz;
  assignment?: Assignment;
}

export interface Quiz {
  questions: Question[];
  passingScore: number;
  timeLimit: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface Assignment {
  title: string;
  description: string;
  submissionType: 'text' | 'file' | 'code';
  maxScore: number;
  dueDate: Date;
}

export class IPFSStorage {
  private client: any;
  private nodeUrl: string;

  constructor(nodeUrl: string = 'https://ipfs.infura.io:5001') {
    this.nodeUrl = nodeUrl;
    this.client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from('2K3gZjJpXw4vN8tDqF1sYfQ7XcB5rHmWvE6kL9bC8nA3pP2sT1uR:0a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef0123456789').toString('base64')}`
      }
    });
  }

  // Upload course content to IPFS
  async uploadCourseContent(courseContent: CourseContent): Promise<string> {
    try {
      const contentString = JSON.stringify(courseContent, null, 2);
      const buffer = Buffer.from(contentString);
      
      const result = await this.client.add(buffer);
      console.log(`Course content uploaded to IPFS: ${result.cid}`);
      
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading course content to IPFS:', error);
      throw error;
    }
  }

  // Retrieve course content from IPFS
  async getCourseContent(cid: string): Promise<CourseContent> {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      
      const content = Buffer.concat(chunks).toString();
      return JSON.parse(content) as CourseContent;
    } catch (error) {
      console.error('Error retrieving course content from IPFS:', error);
      throw error;
    }
  }

  // Upload video content
  async uploadVideo(videoBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const result = await this.client.add({
        path: fileName,
        content: videoBuffer
      });
      
      console.log(`Video uploaded to IPFS: ${result.cid}`);
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading video to IPFS:', error);
      throw error;
    }
  }

  // Upload document (PDF, etc.)
  async uploadDocument(documentBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const result = await this.client.add({
        path: fileName,
        content: documentBuffer
      });
      
      console.log(`Document uploaded to IPFS: ${result.cid}`);
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading document to IPFS:', error);
      throw error;
    }
  }

  // Upload student submission
  async uploadSubmission(submission: any, studentId: string, assignmentId: string): Promise<string> {
    try {
      const submissionData = {
        studentId,
        assignmentId,
        timestamp: new Date().toISOString(),
        content: submission
      };
      
      const contentString = JSON.stringify(submissionData, null, 2);
      const buffer = Buffer.from(contentString);
      
      const result = await this.client.add(buffer);
      console.log(`Submission uploaded to IPFS: ${result.cid}`);
      
      return result.cid.toString();
    } catch (error) {
      console.error('Error uploading submission to IPFS:', error);
      throw error;
    }
  }

  // Create course metadata for NFT
  async createCourseMetadata(
    courseContent: CourseContent,
    contentCid: string,
    videoCids: { [key: string]: string } = {},
    documentCids: { [key: string]: string } = {}
  ): Promise<any> {
    const metadata = {
      name: courseContent.title,
      description: courseContent.description,
      image: `ipfs://QmHashForCourseImage`, // Would be actual IPFS hash
      external_url: "https://educhain.io",
      attributes: [
        {
          trait_type: "Duration",
          value: courseContent.duration
        },
        {
          trait_type: "Difficulty",
          value: courseContent.difficulty
        },
        {
          trait_type: "Modules",
          value: courseContent.modules.length
        },
        {
          trait_type: "Skills",
          value: courseContent.skills
        },
        {
          trait_type: "Content CID",
          value: contentCid
        }
      ],
      content: {
        cid: contentCid,
        videos: videoCids,
        documents: documentCids
      },
      created_at: new Date().toISOString()
    };

    const metadataString = JSON.stringify(metadata, null, 2);
    const buffer = Buffer.from(metadataString);
    
    const result = await this.client.add(buffer);
    console.log(`Course metadata uploaded to IPFS: ${result.cid}`);
    
    return {
      metadataCid: result.cid.toString(),
      metadata
    };
  }

  // Pin content to ensure persistence
  async pinContent(cid: string): Promise<void> {
    try {
      await this.client.pin.add(cid);
      console.log(`Content pinned: ${cid}`);
    } catch (error) {
      console.error('Error pinning content:', error);
      throw error;
    }
  }

  // Get file from IPFS as buffer
  async getFile(cid: string): Promise<Buffer> {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      throw error;
    }
  }

  // Create directory structure for course
  async createCourseDirectory(courseContent: CourseContent): Promise<string> {
    try {
      const directory = [];
      
      // Add main content file
      const contentCid = await this.uploadCourseContent(courseContent);
      directory.push({
        path: 'content.json',
        cid: contentCid
      });

      // Add videos if they exist
      const videoCids: { [key: string]: string } = {};
      for (const module of courseContent.modules) {
        if (module.videoUrl) {
          // In a real implementation, you would upload the actual video file
          const videoCid = `QmVideo${module.id}Hash`;
          videoCids[module.id] = videoCid;
          directory.push({
            path: `videos/${module.id}.mp4`,
            cid: videoCid
          });
        }
      }

      // Add documents if they exist
      const documentCids: { [key: string]: string } = {};
      for (const module of courseContent.modules) {
        if (module.readingMaterial) {
          // In a real implementation, you would upload the actual document
          const docCid = `QmDoc${module.id}Hash`;
          documentCids[module.id] = docCid;
          directory.push({
            path: `documents/${module.id}.pdf`,
            cid: docCid
          });
        }
      }

      // Create and upload directory manifest
      const manifest = {
        name: courseContent.title,
        type: 'directory',
        files: directory
      };

      const manifestCid = await this.client.uploadDirectory(directory);
      
      // Create metadata with all CIDs
      const { metadataCid } = await this.createCourseMetadata(
        courseContent,
        contentCid,
        videoCids,
        documentCids
      );

      return metadataCid;
    } catch (error) {
      console.error('Error creating course directory:', error);
      throw error;
    }
  }

  // Verify content integrity
  async verifyContentIntegrity(cid: string, expectedHash?: string): Promise<boolean> {
    try {
      const content = await this.getCourseContent(cid);
      const actualHash = Buffer.from(JSON.stringify(content)).toString('base64');
      
      if (expectedHash) {
        return actualHash === expectedHash;
      }
      
      return true; // Content exists and is retrievable
    } catch (error) {
      console.error('Error verifying content integrity:', error);
      return false;
    }
  }

  // Get IPFS gateway URL for public access
  getGatewayUrl(cid: string): string {
    return `https://ipfs.io/ipfs/${cid}`;
  }

  // List pinned content
  async listPinnedContent(): Promise<string[]> {
    try {
      const pins = [];
      for await (const pin of this.client.pin.ls()) {
        pins.push(pin.cid.toString());
      }
      return pins;
    } catch (error) {
      console.error('Error listing pinned content:', error);
      return [];
    }
  }

  // Remove content (unpin)
  async removeContent(cid: string): Promise<void> {
    try {
      await this.client.pin.rm(cid);
      console.log(`Content unpinned: ${cid}`);
    } catch (error) {
      console.error('Error removing content:', error);
      throw error;
    }
  }
}
